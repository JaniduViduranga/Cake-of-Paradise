export default function SectionHeading({ title, subtitle, centered = true, light = false }) {
  return (
    <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
      <h2 className={`section-heading ${light ? 'text-white' : 'text-[#F5AFAF]'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`section-subheading max-w-2xl ${centered ? 'mx-auto' : ''} ${light ? 'text-white/80' : 'text-[#57595B]'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
