import React from "react";
import Link from "next/link";
import Image from "next/image";
// test trigger
export default function Header() {
  return (
    <header className="w-full bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo → use Link + Image */}
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <Image
            src="/assets/images/logo.png"       // put under /public
            alt="A.M.A"
            width={120}                          // required
            height={36}                          // required
            priority
          />
        </Link>

        {/* Nav → internal routes use Link */}
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm hover:underline">
            Home
          </Link>
          <Link href="/about" className="text-sm hover:underline">
            About
          </Link>
          <Link href="/contact" className="text-sm hover:underline">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
