"use client";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function CTAButton({ href, children }: CTAButtonProps) {
  const handleClick = () => {
    window.dispatchEvent(new Event('cta-propuesta-click'));
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#25D366]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
    >
      {children}
    </a>
  );
}
