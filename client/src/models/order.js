/**
 * Data model and business logic for creating Custom Orders.
 */

export const ORDER_TYPES = [
  'Standard Cakes',
  'Birthday Cakes',
  'Wedding Cakes',
  'Cupcakes',
];

export const CUPCAKE_QUANTITIES = [6, 12, 24];

// Weight multipliers relative to a base 500g cake
export const WEIGHT_MULTIPLIERS = {
  '500g': 0.6,
  '1kg': 1,
  '1.5kg': 1.5,
  '2kg': 1.9,
  '3kg': 2.8,
};

// Pricing for cupcake packs
export const CUPCAKE_PRICING = {
  6: 25,
  12: 45,
  24: 85,
};

/**
 * Calculates the estimated price for an order
 */
export function calculateEstimatedPrice(basePrice, orderType, weight, cupcakeQuantity) {
  let price = 0;
  
  if (orderType === 'Cupcakes') {
    price = CUPCAKE_PRICING[cupcakeQuantity] || 0;
  } else {
    // For standard, birthday, and wedding cakes
    const multiplier = WEIGHT_MULTIPLIERS[weight] || 1;
    price = basePrice * multiplier;
    
    // Add premium for tiered wedding cakes
    if (orderType === 'Wedding Cakes') {
      price += 50;
    }
  }

  return price;
}

/**
 * Factory function to create an Order object
 */
export function createOrder({
  id,
  name,
  image,
  basePrice = 45,
  orderType = 'Standard Cakes',
  flavor = 'Butter Cake',
  weight = '1kg',
  cupcakeQuantity = 12,
  customMessage = '',
  referenceImage = null,
  deliveryDate = '',
  timeSlot = '',
  quantity = 1,
}) {
  const finalPrice = calculateEstimatedPrice(basePrice, orderType, weight, cupcakeQuantity);
  
  return {
    cartItemId: `${id}-${Date.now()}`,
    id,
    name,
    image,
    price: finalPrice,
    orderType,
    flavor,
    weight: orderType === 'Cupcakes' ? null : weight,
    cupcakeQuantity: orderType === 'Cupcakes' ? cupcakeQuantity : null,
    customMessage: (orderType === 'Birthday Cakes' || orderType === 'Wedding Cakes') ? customMessage : null,
    referenceImage: (orderType === 'Birthday Cakes' || orderType === 'Wedding Cakes') ? referenceImage : null,
    deliveryDate,
    timeSlot,
    quantity,
  };
}
