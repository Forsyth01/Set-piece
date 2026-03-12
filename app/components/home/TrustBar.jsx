"use client";

export default function TrustBar() {
  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-6 sm:py-16 py-10">
        <div className="flex flex-row gap-12">
          <Value title="100%" subtitle="AUTHENTIC" />
          <Value title="S–3XL" subtitle="SIZE RANGE" />
        </div>
      </div>
    </section>
  );
}

function Value({ title, subtitle }) {
  return (
    <div className="flex flex-col group cursor-default">
      <span className="font-bold leading-none text-[clamp(1.75rem,4vw,3rem)] black tracking-tight transition-colors duration-300 group-hover:text-gray-700">
        {title}
      </span>
      <span className="mt-2 tracking-widest text-gray-500 text-[clamp(0.6rem,1.2vw,0.75rem)] inter transition-colors duration-300 group-hover:text-gray-700">
        {subtitle}
      </span>
    </div>
  );
}
