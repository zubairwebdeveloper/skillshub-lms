"use client";

import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Users,
  BookOpen,
  Star,
  Sparkles,
  Code2,
  Palette,
  BrainCircuit,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

/* =========================================================
   DATA
========================================================= */

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Categories", href: "/categories" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const categories = [
  { name: "Web Development", icon: Code2 },
  { name: "React & Next.js", icon: Code2 },
  { name: "AI & Chatbots", icon: BrainCircuit },
  { name: "UI/UX Design", icon: Palette },
];

const socials = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
];

const stats = [
  { icon: Users, value: "12,000+", label: "Students taught" },
  { icon: BookOpen, value: "180+", label: "Courses live" },
  { icon: Star, value: "4.9 / 5", label: "Average rating" },
];

const learnerInitials = [
  { initials: "AK", color: "from-amber-400 to-orange-500" },
  { initials: "SR", color: "from-violet-400 to-fuchsia-500" },
  { initials: "MH", color: "from-emerald-400 to-teal-500" },
  { initials: "ZB", color: "from-sky-400 to-blue-500" },
];

const paymentMethods = ["Visa", "Mastercard", "JazzCash", "EasyPaisa"];

/* =========================================================
   ANIMATED LINK — underline draws in on hover
========================================================= */

function AnimatedLink({ href, children }) {
  return (
    <Link
      href={href}
      className="group relative  inline-flex w-fit items-center text-slate-400 transition-colors duration-200 hover:text-white"
    >
      <span>{children}</span>
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-amber-400  to-orange-300 transition-all duration-300 ease-out group-hover:w-full" />
    </Link>
  );
}

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#070B16] text-slate-300">
      {/* faint dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(148,163,184,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ambient glow orbs */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-indigo-600/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-amber-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[100px]" />

      {/* =================================================
          TOP CTA + NEWSLETTER (glass panel)
      ================================================= */}

      <div className="relative mx-auto max-w-7xl px-6 pt-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
          {/* inner sheen */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <Badge className="mb-4 gap-1.5 py-6 px-6 rounded-full border border-amber-400/20 bg-amber-400/10  text-amber-300 hover:bg-amber-400/10">
                <Sparkles className="h-3.5 w-3.5" />
                New cohorts open monthly
              </Badge>

              <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                Your next skill is
                <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                  {" "}
                  one course away.
                </span>
              </h2>

              <p className="mt-3 max-w-md text-slate-400">
                Project-based, instructor-led courses built for people who learn
                by shipping — not just watching.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex -space-x-3">
                  {learnerInitials.map(({ initials, color }) => (
                    <div
                      key={initials}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#070B16] bg-gradient-to-br ${color} text-sm font-semibold text-slate-950`}
                    >
                      {initials}
                    </div>
                  ))}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#070B16] bg-white/10 text-[10px] font-medium text-slate-300">
                    +12k
                  </div>
                </div>

                <p className="text-md text-slate-400">
                  <span className="text-white">Loved by learners</span> who
                  started exactly where you are now
                </p>
              </div>
            </div>

            <div className="w-full max-w-sm shrink-0">
              <p className="mb-2 text-md font-medium text-slate-300">
                Get course drops in your inbox
              </p>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center gap-2"
              >
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-amber-400/50"
                />

                <Button
                  type="submit"
                  className="h-11 shrink-0 gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5 hover:from-amber-300 hover:to-orange-400"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <p className="mt-2 text-sm text-slate-500">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* STATS ROW */}

          <div className="relative mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="group flex flex-col items-center gap-1.5 rounded-2xl px-3 py-4 text-center transition-all duration-300 hover:bg-white/[0.04]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-amber-300 transition-transform duration-300 group-hover:scale-110 group-hover:border-amber-400/30">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-lg font-semibold text-white sm:text-xl">
                  {value}
                </span>
                <span className="text-sm text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* BRAND */}

        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-3 text-slate-950 shadow-lg shadow-amber-500/20 transition-transform duration-300 hover:scale-105 hover:rotate-3">
              <GraduationCap size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">Skills Hub</h2>
              <p className="text-md text-slate-400">Premium LMS</p>
            </div>
          </div>

          <p className="mt-5 leading-7 text-slate-400">
            Learn modern Web Development, AI, Programming, and Chatbot
            Automation with practical projects and expert guidance.
          </p>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-sm leading-relaxed text-slate-400">
            <Heart className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
            <span>
              Built by instructors who&apos;ve sat where you&apos;re sitting —
              every course is taught, not just recorded.
            </span>
          </div>

          <div className="mt-6 flex gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="group rounded-xl border border-white/10 bg-white/5 p-3 text-slate-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/30 hover:bg-gradient-to-br hover:from-amber-400 hover:to-orange-500 hover:text-slate-950 hover:shadow-lg hover:shadow-amber-500/25"
              >
                <Icon size={18} />
              </Link>
            ))}
          </div>
        </div>

        {/* QUICK LINKS */}

        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">Quick Links</h3>

          <ul className="space-y-3.5">
            {quickLinks.map((item) => (
              <li key={item.name}>
                <AnimatedLink href={item.href}>{item.name}</AnimatedLink>
              </li>
            ))}
          </ul>
        </div>

        {/* CATEGORIES */}

        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Popular Courses
          </h3>

          <ul className="space-y-3">
            {categories.map(({ name, icon: Icon }) => (
              <li key={name}>
                <Link
                  href="/courses"
                  className="group flex items-center gap-2.5 text-slate-400 transition-colors duration-200 hover:text-white"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all duration-200 group-hover:border-amber-400/30 group-hover:bg-amber-400/10 group-hover:text-amber-300">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="relative">
                    {name}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-amber-400 to-orange-300 transition-all duration-300 ease-out group-hover:w-full" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}

        <div>
          <h3 className="mb-1.5 text-lg font-semibold text-white">Contact</h3>

          <div className="mb-5 flex items-center gap-2 text-sm text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Support online — replies within 2 hrs
          </div>

          <div className="space-y-4">
            <a
              href="mailto:support@skillshub.com"
              className="group flex items-start gap-3 transition-colors hover:text-white"
            >
              <span className="mt-0.5 rounded-lg border border-white/10 bg-white/5 p-2 transition-colors group-hover:border-amber-400/30 group-hover:bg-amber-400/10">
                <Mail className="text-amber-300" size={16} />
              </span>
              <span className="pt-1.5 text-md">support@skillshub.com</span>
            </a>

            <a
              href="tel:+923001234567"
              className="group flex items-start gap-3 transition-colors hover:text-white"
            >
              <span className="mt-0.5 rounded-lg border border-white/10 bg-white/5 p-2 transition-colors group-hover:border-amber-400/30 group-hover:bg-amber-400/10">
                <Phone className="text-amber-300" size={16} />
              </span>
              <span className="pt-1.5 text-md">+92 300 1234567</span>
            </a>

            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-lg border border-white/10 bg-white/5 p-2">
                <MapPin className="text-amber-300" size={16} />
              </span>
              <span className="pt-1.5 text-md">Pakistan</span>
            </div>
          </div>

          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-md font-medium text-emerald-300 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400/20"
          >
            <FaWhatsapp size={16} />
            Chat with us on WhatsApp
          </a>
        </div>
      </div>

      <Separator className="relative bg-white/10" />

      {/* PAYMENT / TRUST STRIP */}

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-b border-white/10 px-6 py-5 sm:flex-row">
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Secure checkout · Certificates on completion
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-400"
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      {/* =================================================
          BOTTOM BAR
      ================================================= */}

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-md text-slate-500 md:flex-row">
        <p>© {new Date().getFullYear()} Skills Hub. All rights reserved.</p>

        <div className="flex gap-6">
          <AnimatedLink href="/privacy">Privacy Policy</AnimatedLink>
          <AnimatedLink href="/terms">Terms &amp; Conditions</AnimatedLink>
        </div>
      </div>
    </footer>
  );
}
