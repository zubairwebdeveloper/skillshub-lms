import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Categories", href: "/categories" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const categories = [
  "Web Development",
  "React & Next.js",
  "JavaScript",
  "Python",
  "AI & Chatbots",
  "UI/UX Design",
];

const socials = [
  { icon: FaFacebookF, href: "#" },
  { icon: FaInstagram, href: "#" },
  { icon: FaLinkedinIn, href: "#" },
  { icon: FaYoutube, href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* Top CTA */}
      <div className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Ready to Start Learning?
            </h2>

            <p className="mt-2 max-w-xl text-slate-400">
              Join thousands of students and build your future with premium
              coding courses.
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Explore Courses
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-3 text-white">
              <GraduationCap size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">Skills Hub</h2>
              <p className="text-sm text-slate-400">Premium LMS</p>
            </div>
          </div>

          <p className="mt-5 leading-7 text-slate-400">
            Learn modern Web Development, AI, Programming, and Chatbot
            Automation with practical projects and expert guidance.
          </p>

          <div className="mt-6 flex gap-3">
            {socials.map(({ icon: Icon, href }, index) => (
              <Link
                key={index}
                href={href}
                className="rounded-xl bg-slate-900 p-3 transition hover:bg-blue-600 hover:text-white"
              >
                <Icon size={18} />
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">Quick Links</h3>

          <ul className="space-y-3">
            {quickLinks.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="transition hover:text-blue-400"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Popular Courses
          </h3>

          <ul className="space-y-3">
            {categories.map((item) => (
              <li key={item}>
                <Link
                  href="/courses"
                  className="transition hover:text-blue-400"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">Contact</h3>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <Mail className="mt-1 text-blue-500" size={18} />
              <span>support@skillshub.com</span>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-1 text-blue-500" size={18} />
              <span>+92 300 1234567</span>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-1 text-blue-500" size={18} />
              <span>Pakistan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} Skills Hub. All rights reserved.</p>

          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-blue-400">
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-blue-400">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
