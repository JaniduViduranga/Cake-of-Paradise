import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { CAKES } from '../models/cakes';
import { useCart } from '../context/CartContext';
import { createOrder, calculateEstimatedPrice, ORDER_TYPES, CUPCAKE_QUANTITIES } from '../models/order';

export const TIME_SLOTS = [
  'Morning 08:00 AM - 11:00 AM',
  'Afternoon 11:00 AM - 03:00 PM',
  'Evening 03:00 PM - 07:00 PM',
];

export const STANDARD_FLAVORS = [
  { label: 'Butter Cake', value: 'butter' },
  { label: 'Chocolate Cake', value: 'chocolate' },
  { label: 'Ribbon Cake', value: 'ribbon' },
  { label: 'Date Cake', value: 'date' },
  { label: 'Coconut Cake', value: 'coconut' },
  { label: 'Coffee Cake', value: 'coffee' },
];

export const WEDDING_FLAVORS = [
  { label: 'Butter Cake', value: 'butter', modifier: 0 },
  { label: 'Ribbon Cake', value: 'ribbon', modifier: 0 },
  { label: 'Fruit Cake', value: 'fruit', modifier: 0 },
  { label: 'Chocolate Fudge', value: 'chocolate-fudge', modifier: 0 },
];

export const PREMIUM_FLAVORS = [
  { label: 'Butter', value: 'red-velvet', modifier: 0 },
  { label: 'Chocolate', value: 'dark-chocolate', modifier: 0 },
  { label: 'Coffee', value: 'vanilla-bean', modifier: 0 },
  { label: 'Fruit', value: 'lemon-raspberry', modifier: 0 },
  { label: 'Ribbon', value: 'salted-caramel', modifier: 0 },
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

  const [selectedFlavor, setSelectedFlavor] = useState(
    initialOrderType === 'Standard Cakes' ? STANDARD_FLAVORS[0].value : PREMIUM_FLAVORS[0].value
  );

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

  // Handle order type changes
  useEffect(() => {
    if (orderType === 'Cupcakes') {
      setMessage('');
      setDesignPreview(null);
      setSelectedFlavor(PREMIUM_FLAVORS[0].value);
    } else if (orderType === 'Standard Cakes') {
      setMessage('');
      setDesignPreview(null);
      setSelectedFlavor(STANDARD_FLAVORS[0].value);
    } else if (orderType === 'Wedding Cakes') {
      setSelectedFlavor(WEDDING_FLAVORS[0].value);
      setSelectedSize('2kg');
    } else {
      setSelectedFlavor(PREMIUM_FLAVORS[0].value);
    }
  }, [orderType]);

  const activeFlavors = orderType === 'Standard Cakes' ? STANDARD_FLAVORS :
    orderType === 'Wedding Cakes' ? WEDDING_FLAVORS : PREMIUM_FLAVORS;

  const currentFlavorObj = useMemo(() => {
    return activeFlavors.find(f => f.value === selectedFlavor) || activeFlavors[0];
  }, [selectedFlavor, activeFlavors]);

  const totalPrice = useMemo(() => {
    const weddingConfig = orderType === 'Wedding Cakes' ? {
      packageType: weddingPackageType,
      structureSetup: weddingStructureSetup,
      structureTiers: weddingStructureTiers,
      includeFreshFlowers: weddingIncludeFreshFlowers,
      flavor: currentFlavorObj.label,
      realCakeWeight: selectedSize,
      themeNotes,
    } : null;

    const base = calculateEstimatedPrice(basePrice, orderType, selectedSize, cupcakeQuantity, weddingConfig);
    const modifier = currentFlavorObj.modifier || 0;
    return base + modifier;
  }, [basePrice, orderType, selectedSize, cupcakeQuantity, currentFlavorObj, weddingPackageType, weddingStructureSetup, weddingStructureTiers, weddingIncludeFreshFlowers, themeNotes]);

  // Submit custom order to Express API & MongoDB Atlas
  const submitCustomOrder = async () => {
    if (!pickupDate) {
      alert('Please select a delivery / pickup date.');
      return;
    }

    setLoading(true);

    const weddingConfig = orderType === 'Wedding Cakes' ? {
      packageType: weddingPackageType,
      structureSetup: weddingStructureSetup,
      structureTiers: weddingStructureTiers,
      includeFreshFlowers: weddingIncludeFreshFlowers,
      flavor: currentFlavorObj.label,
      realCakeWeight: selectedSize,
      themeNotes,
    } : null;

    // Payload formatted to match your backend createOrder controller
    const orderPayload = {
      orderType,
      flavor: currentFlavorObj.label,
      cakeSize: orderType === 'Cupcakes' ? `${cupcakeQuantity} Pack` : selectedSize,
      deliveryDate: pickupDate,
      deliveryTimeSlot: timeSlot,
      totalPrice: Number(totalPrice),
      message: message || '',
      themeNotes: themeNotes || '',
      designPreview: designPreview || '',
      weddingConfig: weddingConfig || undefined,
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Also save to local Cart Context for checkout preview
        const localOrder = createOrder({
          id: result.data._id || `custom-${Date.now()}`,
          name: `${orderType} - ${currentFlavorObj.label}`,
          image: locationState.image || null,
          basePrice,
          orderType,
          flavor: currentFlavorObj.label,
          weight: selectedSize,
          cupcakeQuantity,
          customMessage: message,
          referenceImage: designPreview,
          deliveryDate: pickupDate,
          timeSlot,
          quantity: 1,
          weddingConfig,
        });

        addToCart(localOrder);

        setAdded(true);
        alert(`🎉 Order saved to MongoDB! Order ID: ${result.data._id}`);
        setTimeout(() => setAdded(false), 2500);
      } else {
        alert(`❌ Server rejected order: ${result.message || 'Validation error'}`);
      }
    } catch (error) {
      console.error('Failed to submit order:', error);
      alert('Could not connect to backend server. Make sure port 5000 is active.');
    } finally {
      setLoading(false);
    }
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
    activeFlavors,
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