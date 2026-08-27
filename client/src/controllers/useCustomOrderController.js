import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { CAKES } from '../models/cakes';
import { useCart } from '../context/CartContext';
import { createOrder, calculateEstimatedPrice, ORDER_TYPES, CUPCAKE_QUANTITIES } from '../models/order';

export const TIME_SLOTS = [
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
  '6:00 PM - 8:00 PM',
];

export const STANDARD_FLAVORS = [
  { label: 'Butter Cake', value: 'butter' },
  { label: 'Chocolate Cake', value: 'chocolate' },
  { label: 'Ribbon Cake', value: 'ribbon' },
  { label: 'Date Cake', value: 'date' },
  { label: 'Coconut Cake', value: 'coconut' },
];

export const PREMIUM_FLAVORS = [
  { label: 'Red Velvet Cream Cheese', value: 'red-velvet', modifier: 0 },
  { label: 'Midnight Dark Chocolate', value: 'dark-chocolate', modifier: 0 },
  { label: 'Classic Vanilla Bean', value: 'vanilla-bean', modifier: 0 },
  { label: 'Lemon & Raspberry', value: 'lemon-raspberry', modifier: 5 },
  { label: 'Salted Caramel Praline', value: 'salted-caramel', modifier: 5 },
  { label: 'Pistachio Rose', value: 'pistachio-rose', modifier: 10 },
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
    } else {
      setSelectedFlavor(PREMIUM_FLAVORS[0].value);
    }
  }, [orderType]);

  const activeFlavors = orderType === 'Standard Cakes' ? STANDARD_FLAVORS : PREMIUM_FLAVORS;
  
  const currentFlavorObj = useMemo(() => {
    return activeFlavors.find(f => f.value === selectedFlavor) || activeFlavors[0];
  }, [selectedFlavor, activeFlavors]);

  const totalPrice = useMemo(() => {
    const base = calculateEstimatedPrice(basePrice, orderType, selectedSize, cupcakeQuantity);
    const modifier = currentFlavorObj.modifier || 0;
    return base + modifier;
  }, [basePrice, orderType, selectedSize, cupcakeQuantity, currentFlavorObj]);

  const submitCustomOrder = () => {
    const order = createOrder({
      id: locationState.id || `custom-${Date.now()}`,
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
    });
    
    addToCart(order);
    
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
  };
}
