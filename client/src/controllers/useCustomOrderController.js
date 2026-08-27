import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CAKES } from '../models/cakes';
import { useCart } from '../context/CartContext';

export const TIME_SLOTS = [
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
  '6:00 PM - 8:00 PM',
];

/**
 * Controller managing Custom Order customization options, pricing calculations, and cart submission
 */
export function useCustomOrderController() {
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();

  const cakeId = searchParams.get('cake');
  const selectedCake = CAKES.find((c) => c.id === cakeId) || CAKES[3]; // Defaults to Red Velvet Dream

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('1kg');
  const [sizeModifier, setSizeModifier] = useState(10);
  const [selectedFlavor, setSelectedFlavor] = useState('red-velvet');
  const [flavorModifier, setFlavorModifier] = useState(0);
  const [isEggless, setIsEggless] = useState(false);
  const [message, setMessage] = useState('');
  const [designPreview, setDesignPreview] = useState(null);
  const [pickupDate, setPickupDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [added, setAdded] = useState(false);

  const egglessModifier = isEggless ? 5 : 0;
  const totalPrice = useMemo(
    () => selectedCake.basePrice + sizeModifier + flavorModifier + egglessModifier,
    [selectedCake.basePrice, sizeModifier, flavorModifier, egglessModifier]
  );

  const handleSizeChange = (size, modifier) => {
    setSelectedSize(size);
    setSizeModifier(modifier);
  };

  const handleFlavorChange = (flavor, modifier) => {
    setSelectedFlavor(flavor);
    setFlavorModifier(modifier);
  };

  const submitCustomOrder = (flavorLabel) => {
    addToCart({
      cartItemId: `${selectedCake.id}-${Date.now()}`,
      id: selectedCake.id,
      name: selectedCake.name,
      image: selectedCake.image,
      price: totalPrice,
      size: selectedSize,
      flavor: flavorLabel,
      message,
      pickupDate,
      timeSlot,
      isEggless,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const cakeImages = [selectedCake.image, ...CAKES.slice(0, 3).map((c) => c.image)].slice(0, 4);
  const relatedCakes = CAKES.filter((c) => c.id !== selectedCake.id).slice(0, 4);

  return {
    selectedCake,
    activeImage,
    setActiveImage,
    cakeImages,
    selectedSize,
    handleSizeChange,
    selectedFlavor,
    handleFlavorChange,
    isEggless,
    setIsEggless,
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
    sizeModifier,
    flavorModifier,
    egglessModifier,
    submitCustomOrder,
    added,
    relatedCakes,
  };
}
