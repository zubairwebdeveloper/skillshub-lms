"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import UserDropdown from "@/components/UserDropdown";
import MobileNav from "@/components/Mobilenav";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

/* =========================
   HOME
========================= */

const home = [
  {
    name: "Home",
    description:
      "Explore Skills Hub, discover premium courses, and start building practical skills for your career.",
    href: "/",
  },
  {
    name: "About",
    description:
      "Discover Skills Hub, our mission, and how we help learners build real-world skills.",
    href: "/about",
  },
  {
    name: "Courses",
    description:
      "Explore our premium courses and learn practical, in-demand skills from beginner to advanced.",
    href: "/courses",
  },
  {
    name: "Pricing",
    description:
      "Choose the right learning plan and unlock premium courses and features.",
    href: "/Pricing",
  },
  {
    name: "Contact",
    description:
      "Have a question or need help? Get in touch with the Skills Hub team.",
    href: "/contact",
  },
];

/* =========================
   CATEGORIES
========================= */

const categories = [
  {
    name: "Beginner",
    description: "Start learning from the basics.",
    href: "/Categories/beginner",
  },
  {
    name: "Intermediate",
    description: "Improve your existing skills.",
    href: "/Categories/intermediate",
  },
  {
    name: "Advanced",
    description: "Master advanced technologies.",
    href: "/Categories/advanced",
  },
  {
    name: "Career",
    description: "Build career-ready skills.",
    href: "/Categories/career",
  },
];

/* =========================
   COURSES
========================= */

const courses = [
  {
    name: "My Courses",
    description: "Build modern websites and web applications.",
    href: "/my-courses",
  },
  {
    name: "Web Development",
    description: "Build modern websites and web applications.",
    href: "/Courses/web-development",
  },
  {
    name: "Data Science",
    description: "Learn Python, data and analytics.",
    href: "/Courses/data-science",
  },
  {
    name: "UI/UX Design",
    description: "Create beautiful user experiences.",
    href: "/Courses/design",
  },
  {
    name: "Digital Marketing",
    description: "Grow businesses through digital marketing.",
    href: "/Courses/marketing",
  },
];

/* =========================
   SUBSCRIPTIONS
========================= */

const subscriptions = [
  {
    name: "Free Plan",
    description: "Start learning for free.",
    href: "/Pricing#free",
  },
  {
    name: "Pro Plan",
    description: "Unlock premium courses.",
    href: "/Pricing#pro",
  },
  {
    name: "Premium",
    description: "Get full access to Skills Hub.",
    href: "/Pricing#premium",
  },
];

/* =========================
   MOBILE NAV LINKS
========================= */

const mobileNavLinks = [
  ...home,

  {
    name: "Categories",
    href: "/Categories",
    children: categories,
  },

  {
    name: "Courses",
    href: "/Courses",
    children: courses,
  },

  {
    name: "Subscription",
    href: "/Pricing",
    children: subscriptions,
  },
];

/* =========================
   NAV LINK
========================= */

function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`group relative inline-flex h-10 items-center justify-center px-4 py-2 text-md font-medium transition-colors duration-200 ${
        isActive ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
      }`}
    >
      {children}

      <span
        className={`absolute -bottom-1 left-4 right-4 h-[2.5px] origin-left rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-transform duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100 ${
          isActive ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </Link>
  );
}

/* =========================
   NAV TRIGGER UNDERLINE (shared style for dropdown triggers)
========================= */

const triggerUnderline =
  "absolute -bottom-1 left-4 right-4 h-[2.5px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-transform duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100 group-data-[state=open]:scale-x-100";

/* =========================
   NAVBAR
========================= */

export default function Navbar() {
  const [mounted, setMounted] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4  border-b bg-background/80 backdrop-blur-xl dark:bg-gray-800">
      <div className="mx-auto flex h-22 max-w-7xl items-center justify-between  ">
        {/* ================= LOGO ================= */}

        <Link href="/" className="flex items-center gap-2 ">
          <Image
            src="/logo.png"
            alt="Skills Hub"
            width={180}
            height={50}
            priority
            className="h-auto md:w-80 md:pt-4 dark:invert"
          />
        </Link>

        {/* ================= DESKTOP NAV ================= */}

        <NavigationMenu className="hidden lg:flex gap-5 justify-around items-center">
          <NavigationMenuList>
            {/* ================= HOME ================= */}

            <NavigationMenuItem>
              <NavigationMenuTrigger className="group relative font-medium text-slate-700 transition-colors duration-200 hover:text-blue-600  data-[state=open]:text-blue-600">
                Home
                <span className={triggerUnderline} />
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <div className="grid w-[500px] grid-cols-2 gap-3 p-4">
                  {home.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group rounded-xl p-4 transition-colors hover:bg-accent"
                    >
                      <div className="mb-1 text-md font-semibold group-hover:text-blue-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">
                        {item.name}
                      </div>

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* ================= CATEGORIES ================= */}

            <NavigationMenuItem>
              <NavigationMenuTrigger className="group relative font-medium text-slate-700 transition-colors duration-200 hover:text-blue-600 data-[state=open]:text-blue-600">
                Categories
                <span className={triggerUnderline} />
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 gap-3 p-4">
                  {categories.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group rounded-xl p-4 transition-colors hover:bg-accent"
                    >
                      <div className="mb-1 text-md font-semibold group-hover:text-blue-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">
                        {item.name}
                      </div>

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* ================= COURSES ================= */}

            <NavigationMenuItem>
              <NavigationMenuTrigger className="group relative font-medium text-slate-700 transition-colors duration-200 hover:text-blue-600 data-[state=open]:text-blue-600">
                Courses
                <span className={triggerUnderline} />
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <div className="grid w-[700px] grid-cols-2 gap-3 p-4">
                  {courses.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group rounded-xl p-4 transition-colors hover:bg-accent"
                    >
                      <div className="mb-1 text-md font-semibold group-hover:text-blue-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">
                        {item.name}
                      </div>

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* ================= SUBSCRIPTION ================= */}

            <NavigationMenuItem>
              <NavigationMenuTrigger className="group relative font-medium text-slate-700 transition-colors duration-200 hover:text-blue-600 data-[state=open]:text-blue-600">
                Subscription
                <span className={triggerUnderline} />
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <div className="w-[360px] p-4">
                  <h3 className="text-md font-semibold">Choose your plan</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Get access to premium learning content.
                  </p>

                  <div className="mt-3 space-y-1">
                    {subscriptions.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="group block rounded-xl p-3 hover:bg-accent"
                      >
                        <div className="text-md font-semibold group-hover:text-blue-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors">
                          {item.name}
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* ================= DESKTOP AUTH ================= */}

        <div className="hidden items-center gap-3 lg:flex">
          {!mounted ? (
            <div className="h-10 w-28" />
          ) : user ? (
            <UserDropdown />
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-md font-medium transition-all hover:border-blue-600 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-md font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* ================= MOBILE ================= */}

        <MobileNav navLinks={mobileNavLinks} user={user} mounted={mounted} />
      </div>
    </header>
  );
}
