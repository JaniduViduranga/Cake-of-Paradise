export const STANDARD_FLAVORS = [
  { id: 'butter', value: 'butter', label: 'Butter' },
  { id: 'chocolate', value: 'chocolate', label: 'Chocolate' },
  { id: 'ribbon', value: 'ribbon', label: 'Ribbon' },
  { id: 'date', value: 'date', label: 'Date' },
  { id: 'coffee', value: 'coffee', label: 'Coffee' },
  { id: 'coconut', value: 'coconut', label: 'Coconut' },
];

export const CELEBRATION_FLAVORS = [
  { id: 'butter', value: 'butter', label: 'Butter' },
  { id: 'chocolate', value: 'chocolate', label: 'Chocolate' },
  { id: 'ribbon', value: 'ribbon', label: 'Ribbon' },
  { id: 'fruit', value: 'fruit', label: 'Fruit' },
  { id: 'coffee', value: 'coffee', label: 'Coffee' },
];

/**
 * Returns available flavors based on order type.
 * Returns STANDARD_FLAVORS when orderType === 'Standard' (or 'Standard Cakes'), otherwise CELEBRATION_FLAVORS.
 */
export function getFlavorsForOrderType(orderType) {
  if (orderType === 'Standard' || orderType === 'Standard Cakes') {
    return STANDARD_FLAVORS;
  }
  return CELEBRATION_FLAVORS;
}
