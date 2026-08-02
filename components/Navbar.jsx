"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Categories", href: "/categories" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Skills Hub - Go to Homepage"
          className="flex items-center gap-3"
        >
          <Image
            src="/logo.png"
            alt="Skills Hub Premium LMS Logo"
            width={180}
            height={50}
            priority
            quality={100}
            className="h-50 w-auto object-contain pt-2 "
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative text-sm font-medium text-slate-600 transition hover:text-blue-600 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold transition hover:bg-slate-100"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 lg:hidden"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t bg-white lg:hidden">
          <div className="space-y-2 p-6">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {item.name}
              </Link>
            ))}

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/login"
                className="rounded-xl border border-slate-300 px-4 py-3 text-center font-semibold"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-center font-semibold text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
