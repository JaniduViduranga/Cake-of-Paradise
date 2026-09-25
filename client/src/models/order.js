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
  '5kg': 4.5,
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
export function calculateEstimatedPrice(basePrice, orderType, weight, cupcakeQuantity, weddingConfig = null) {
  let price = 0;
  
  if (orderType === 'Cupcakes') {
    price = CUPCAKE_PRICING[cupcakeQuantity] || 0;
  } else {
    // For standard, birthday, and wedding cakes
    const multiplier = WEIGHT_MULTIPLIERS[weight] || 1;
    price = basePrice * multiplier;
    
    // Add premium for tiered wedding cakes
    if (orderType === 'Wedding Cakes') {
      if (weddingConfig) {
        if (weddingConfig.packageType === 'cake_and_structure') {
          const tierPrices = { 3: 6000, 4: 9000, 5: 12000 };
          price += tierPrices[weddingConfig.structureTiers] || 0;
        }
        if (weddingConfig.includeFreshFlowers) {
          price += 4500;
        }
      } else {
        price += 50; // Legacy premium
      }
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
  weddingConfig = null,
}) {
  const finalPrice = calculateEstimatedPrice(basePrice, orderType, weight, cupcakeQuantity, weddingConfig);
  
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
    ...(orderType === 'Wedding Cakes' && weddingConfig ? { weddingConfig } : {}),
  };
}
