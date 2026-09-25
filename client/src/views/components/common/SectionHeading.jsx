export default function SectionHeading({ title, subtitle, centered = true, light = false }) {
  return (
    <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
      <h2 className={`section-heading ${light ? 'text-cream-50' : 'text-chocolate-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`section-subheading max-w-2xl ${centered ? 'mx-auto' : ''} ${light ? 'text-cream-200/80' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
