import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { CAKES } from '../models/cakes';
import { useCart } from '../context/CartContext';
import { createOrder, calculateEstimatedPrice, ORDER_TYPES, CUPCAKE_QUANTITIES } from '../models/order';
import { getPricing } from '../services/api';
import {
  STANDARD_FLAVORS,
  CELEBRATION_FLAVORS,
  getFlavorsForOrderType,
} from '../constants/cakeOptions';

export { STANDARD_FLAVORS, CELEBRATION_FLAVORS, getFlavorsForOrderType };

export const TIME_SLOTS = [
  'Morning 08:00 AM - 11:00 AM',
  'Afternoon 11:00 AM - 03:00 PM',
  'Evening 03:00 PM - 07:00 PM',
];

export function useCustomOrderController() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { addToCart } = useCart();

  const locationState = location.state || {};
  const cakeId = searchParams.get('cake');
  const fallbackCake = CAKES.find((c) => c.id === cakeId) || CAKES[3];

  const initialOrderType = locationState.orderType || 'Standard Cakes';
  const [orderType, setOrderType] = useState(initialOrderType);
  const [basePrice, setBasePrice] = useState(locationState.basePrice || 45);

  const [selectedSize, setSelectedSize] = useState('1kg');
  const [cupcakeQuantity, setCupcakeQuantity] = useState(12);

  // Fetch /api/pricing from database
  const [pricingData, setPricingData] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchPricing = async () => {
      try {
        const response = await getPricing();
        if (isMounted && response?.data?.success && Array.isArray(response.data.data)) {
          setPricingData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching database pricing rules:', error);
      }
    };
    fetchPricing();
    return () => {
      isMounted = false;
    };
  }, []);

  // Derive available flavors dynamically for the active order type
  const availableFlavors = useMemo(() => {
    return getFlavorsForOrderType(orderType);
  }, [orderType]);

  const [selectedFlavor, setSelectedFlavor] = useState(
    availableFlavors[0]?.id || availableFlavors[0]?.value || 'butter'
  );

  // Fallback selectedFlavorId to first item of availableFlavors if current flavor is not available
  useEffect(() => {
    const isAvailable = availableFlavors.some(
      (f) => f.value === selectedFlavor || f.id === selectedFlavor
    );
    if (!isAvailable && availableFlavors.length > 0) {
      setSelectedFlavor(availableFlavors[0].value || availableFlavors[0].id);
    }
  }, [availableFlavors, selectedFlavor]);

  const [message, setMessage] = useState('');
  const [designPreview, setDesignPreview] = useState(null);
  const [pickupDate, setPickupDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [weddingPackageType, setWeddingPackageType] = useState('cake_only');
  const [weddingStructureSetup, setWeddingStructureSetup] = useState('bottom_real_upper_dummy');
  const [weddingStructureTiers, setWeddingStructureTiers] = useState(3);
  const [weddingIncludeFreshFlowers, setWeddingIncludeFreshFlowers] = useState(false);
  const [themeNotes, setThemeNotes] = useState('');

  // Reset category-specific fields on orderType change
  useEffect(() => {
    if (orderType === 'Cupcakes' || orderType === 'Standard Cakes' || orderType === 'Standard') {
      setMessage('');
      setDesignPreview(null);
    }
    if (orderType === 'Wedding Cakes') {
      setSelectedSize('2kg');
    }
  }, [orderType]);

  // Current active flavor object
  const currentFlavorObj = useMemo(() => {
    return (
      availableFlavors.find(
        (f) => f.value === selectedFlavor || f.id === selectedFlavor
      ) || availableFlavors[0]
    );
  }, [selectedFlavor, availableFlavors]);

  // Find matching pricing document
  const currentPricingRules = useMemo(() => {
    if (!pricingData || pricingData.length === 0) return null;
    return (
      pricingData.find((p) => {
        if (p.orderType === orderType) return true;
        if (
          (orderType === 'Standard Cakes' || orderType === 'Standard') &&
          (p.orderType === 'Standard' || p.orderType === 'Standard Cakes')
        ) {
          return true;
        }
        return false;
      }) || null
    );
  }, [pricingData, orderType]);

  // Helper to extract flavor surcharge for active rule
  const getFlavorSurcharge = (flavorLabel) => {
    if (!currentPricingRules?.flavorPremiums) return 0;
    const premiums = currentPricingRules.flavorPremiums;
    if (typeof premiums.get === 'function') {
      return premiums.get(flavorLabel) || 0;
    }
    return premiums[flavorLabel] || 0;
  };

  // Convert weight string (e.g. '500g', '1kg', '1.5kg') to numeric kilograms
  const numericWeight = useMemo(() => {
    if (typeof selectedSize === 'string') {
      const lower = selectedSize.toLowerCase().trim();
      if (lower.endsWith('g') && !lower.endsWith('kg')) {
        return (parseFloat(lower) || 500) / 1000;
      }
      return parseFloat(lower) || 1;
    }
    if (typeof selectedSize === 'number') {
      return selectedSize;
    }
    return 1;
  }, [selectedSize]);

  // Dynamic memoized calculation for totalPrice
  const totalPrice = useMemo(() => {
    const rules = currentPricingRules;
    const flavorExtra = currentFlavorObj ? getFlavorSurcharge(currentFlavorObj.label) : 0;

    if (rules) {
      if (orderType === 'Cupcakes') {
        const packKey = `pack${cupcakeQuantity}`;
        const packPrices = rules.cupcakePackPrices;
        const packPrice =
          (packPrices &&
            (typeof packPrices.get === 'function'
              ? packPrices.get(packKey)
              : packPrices[packKey])) ||
          0;
        return packPrice + flavorExtra * (cupcakeQuantity / 6);
      }

      if (orderType === 'Wedding Cakes') {
        let tierRate = 0;
        if (weddingPackageType === 'cake_and_structure') {
          const tierKey = `tier${weddingStructureTiers}`;
          const rates = rules.weddingTierRates;
          tierRate =
            (rates &&
              (typeof rates.get === 'function' ? rates.get(tierKey) : rates[tierKey])) ||
            0;
        }
        const freshFlowersRate = weddingIncludeFreshFlowers ? rules.freshFlowersRate || 0 : 0;
        const perKg = (rules.pricePerKg || 0) + flavorExtra;
        return (rules.basePrice || 0) + tierRate + freshFlowersRate + numericWeight * perKg;
      }

      // Standard / Birthday Cakes
      const perKg = (rules.pricePerKg || 0) + flavorExtra;
      return (rules.basePrice || 0) + numericWeight * perKg;
    }

    // Fallback if database rules are loading or not yet configured
    const weddingConfig =
      orderType === 'Wedding Cakes'
        ? {
            packageType: weddingPackageType,
            structureSetup: weddingStructureSetup,
            structureTiers: weddingStructureTiers,
            includeFreshFlowers: weddingIncludeFreshFlowers,
            flavor: currentFlavorObj.label,
            realCakeWeight: selectedSize,
            themeNotes,
          }
        : null;

    const base = calculateEstimatedPrice(
      basePrice,
      orderType,
      selectedSize,
      cupcakeQuantity,
      weddingConfig
    );
    const modifier = currentFlavorObj.modifier || 0;
    return base + modifier;
  }, [
    currentPricingRules,
    orderType,
    cupcakeQuantity,
    weddingPackageType,
    weddingStructureTiers,
    weddingIncludeFreshFlowers,
    numericWeight,
    currentFlavorObj,
    selectedSize,
    basePrice,
    weddingStructureSetup,
    themeNotes,
  ]);

  // Submit custom order to Express API & MongoDB Atlas
  const submitCustomOrder = () => {
    if (!pickupDate) {
      alert('Please select a delivery / pickup date.');
      return;
    }

    const weddingConfig =
      orderType === 'Wedding Cakes'
        ? {
            packageType: weddingPackageType,
            structureSetup: weddingStructureSetup,
            structureTiers: weddingStructureTiers,
            includeFreshFlowers: weddingIncludeFreshFlowers,
            flavor: currentFlavorObj.label,
            realCakeWeight: selectedSize,
            themeNotes: themeNotes || '',
          }
        : null;

    const localOrder = createOrder({
      id: `cart-${Date.now()}`,
      name: `${orderType} - ${currentFlavorObj.label}`,
      image: locationState?.image || null,
      basePrice,
      orderType,
      flavor: currentFlavorObj.label,
      weight: selectedSize,
      cupcakeQuantity,
      customMessage: message || '',
      referenceImage: designPreview || '',
      deliveryDate: pickupDate,
      timeSlot,
      quantity: 1,
      weddingConfig,
      totalPrice: Number(totalPrice),
      price: Number(totalPrice),
    });

    console.log('🛒 Generated Cart Item:', localOrder);
    addToCart(localOrder);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return {
    orderType,
    setOrderType,
    orderTypes: ORDER_TYPES,
    selectedSize,
    setSelectedSize,
    cupcakeQuantity,
    setCupcakeQuantity,
    cupcakeQuantities: CUPCAKE_QUANTITIES,
    selectedFlavor,
    setSelectedFlavor,
    selectedFlavorId: selectedFlavor,
    setSelectedFlavorId: setSelectedFlavor,
    availableFlavors,
    activeFlavors: availableFlavors,
    currentFlavorObj,
    pricingData,
    currentPricingRules,
    getFlavorSurcharge,
    message,
    setMessage,
    designPreview,
    setDesignPreview,
    pickupDate,
    setPickupDate,
    timeSlot,
    setTimeSlot,
    timeSlots: TIME_SLOTS,
    totalPrice,
    submitCustomOrder,
    added,
    loading,
    weddingPackageType,
    setWeddingPackageType,
    weddingStructureSetup,
    setWeddingStructureSetup,
    weddingStructureTiers,
    setWeddingStructureTiers,
    weddingIncludeFreshFlowers,
    setWeddingIncludeFreshFlowers,
    themeNotes,
    setThemeNotes,
  };
}