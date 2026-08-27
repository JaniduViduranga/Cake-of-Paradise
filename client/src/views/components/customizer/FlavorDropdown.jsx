import { ChevronDown } from 'lucide-react';

export const FLAVORS = [
  { label: 'Red Velvet Cream Cheese (Signature)', value: 'red-velvet', modifier: 0 },
  { label: 'Midnight Dark Chocolate', value: 'dark-chocolate', modifier: 0 },
  { label: 'Classic Vanilla Bean', value: 'vanilla-bean', modifier: 0 },
  { label: 'Lemon & Raspberry', value: 'lemon-raspberry', modifier: 5 },
  { label: 'Salted Caramel Praline', value: 'salted-caramel', modifier: 5 },
  { label: 'Madagascar Vanilla Swiss Meringue', value: 'swiss-meringue', modifier: 8 },
  { label: 'Mango Passionfruit Chiffon', value: 'mango-passion', modifier: 8 },
  { label: 'Pistachio Rose', value: 'pistachio-rose', modifier: 10 },
];

export default function FlavorDropdown({ selected, onChange }) {
  return (
    <div className="relative">
      <select
        id="flavor-select"
        value={selected}
        onChange={(e) => {
          const flavor = FLAVORS.find((f) => f.value === e.target.value);
          onChange(flavor.value, flavor.modifier);
        }}
        className="w-full appearance-none input-field pr-10 cursor-pointer font-montserrat bg-white"
      >
        {FLAVORS.map((flavor) => (
          <option key={flavor.value} value={flavor.value}>
            {flavor.label}{flavor.modifier > 0 ? ` (+$${flavor.modifier})` : ''}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate-800/50 pointer-events-none"
      />
    </div>
  );
}
