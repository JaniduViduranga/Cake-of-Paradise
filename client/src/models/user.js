// ── User Model & Mock Schemas ──────────────────────────────────────────
export const MOCK_USER = {
  id: 'usr_001',
  name: 'Eleanor Vance',
  email: 'eleanor.v@example.com',
  phone: '+1 (555) 123-4567',
  avatar: null,
  addresses: [
    { id: 'addr_1', label: 'Home', street: '123 Willow Lane, Apt 4B', city: 'Portland', state: 'OR', zip: '97204', isDefault: true },
    { id: 'addr_2', label: 'Office', street: '4500 Creative Blvd, Suite 200', city: 'Portland', state: 'OR', zip: '97201', isDefault: false },
  ],
  orders: [
    {
      id: 'ORD-2024-0892',
      date: '2024-11-18',
      status: 'Delivered',
      items: [{ name: 'Midnight Chocolate Truffle', size: '1kg', qty: 1, price: 65 }],
      total: 88.2,
    },
    {
      id: 'ORD-2024-0751',
      date: '2024-10-05',
      status: 'Delivered',
      items: [{ name: 'Classic Vanilla Bean Rose', size: '2kg', qty: 1, price: 250 }],
      total: 282.0,
    },
  ],
  activeOrder: {
    id: 'ORD-2024-1023',
    date: '2024-12-02',
    status: 'In Preparation',
    eta: 'Dec 5, 2024',
    steps: ['Order Received', 'In Preparation', 'Ready for Pickup', 'Delivered'],
    currentStep: 1,
    items: [{ name: 'Red Velvet Dream', size: '1kg', qty: 1, price: 45 }],
  },
};
