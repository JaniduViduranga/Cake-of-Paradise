const SIZES = [
  { label: '500g', value: '500g', modifier: 0 },
  { label: '1kg', value: '1kg', modifier: 10 },
  { label: '2kg', value: '2kg', modifier: 25 },
  { label: '3kg', value: '3kg', modifier: 45 },
];

export default function WeightSelector({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {SIZES.map((size) => (
        <button
          key={size.value}
          id={`size-${size.value}`}
          onClick={() => onChange(size.value, size.modifier)}
          className={`px-5 py-2 rounded-full border font-montserrat font-semibold text-sm transition-all duration-200 ${
            selected === size.value
              ? 'bg-[#F5AFAF] border-[#F5AFAF] text-white shadow-sm'
              : 'bg-white border-divider text-chocolate-800/70 hover:border-[#F5AFAF]'
          }`}
          aria-pressed={selected === size.value}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
}

export { SIZES };
