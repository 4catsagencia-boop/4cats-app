import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-[#e5e5e5]">
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-tight text-[#111]">
          4cats
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/planes"
            className="text-sm text-[#555] hover:text-[#111] transition-colors"
          >
            Planes
          </Link>
          <Link
            href="/cotizar"
            className="text-sm bg-[#111] text-white px-3.5 py-1.5 rounded-md hover:bg-[#333] transition-colors"
          >
            Cotizar
          </Link>
        </div>
      </nav>
    </header>
  );
}
