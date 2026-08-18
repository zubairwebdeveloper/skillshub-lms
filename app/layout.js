import localFont from "next/font/local";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ModeToggle";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

/* =========================================================
   FONTS
========================================================= */

const manrope = localFont({
  src: "./fonts/Manrope-VariableFont_wght.ttf",
  variable: "--font-sans",
  display: "swap",
  weight: "200 800",
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-VariableFont_wght.ttf",
  variable: "--font-mono",
  display: "swap",
  weight: "100 800",
});

/* =========================================================
   METADATA
========================================================= */

export const metadata = {
  metadataBase: new URL("https://skillshub-lms-zeta.vercel.app/"),

  title: {
    default: "LMS Skills Hub | Learn Web Development, AI & Programming",
    template: "%s | LMS Skills Hub",
  },

  description:
    "LMS Skills Hub is a modern online learning platform offering premium courses in Web Development, React, Next.js, JavaScript, AI, Chatbot Automation, Firebase, and more.",

  keywords: [
    "LMS Skills Hub",
    "Programming Courses",
    "Web Development",
    "React",
    "Next.js",
    "JavaScript",
    "Tailwind CSS",
    "Firebase",
    "AI",
    "Chatbot Development",
    "Online Learning",
    "Developer Courses",
  ],

  authors: [
    {
      name: "Zubair Developer",
    },
  ],

  creator: "Zubair Developer",
  publisher: "LMS Skills Hub",

  openGraph: {
    title: "LMS Skills Hub",
    description:
      "Master Web Development, AI, Chatbot Automation, and Programming through premium online courses and real-world projects.",
    type: "website",
    locale: "en_US",
    siteName: "LMS Skills Hub",
  },

  twitter: {
    card: "summary_large_image",
    title: "LMS Skills Hub",
    description: "Premium Coding & AI Learning Platform for Future Developers.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

/* =========================================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen  antialiased dark:bg-gray-800">
        <TooltipProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex min-h-screen flex-col">
                <Navbar />

                <main className="flex-1">
                  <div className="mx-auto w-full max-w-7xl px-1 py-8 md:px-4 lg:px-8">
                    {children}
                  </div>
                </main>

                <Toaster position="top-center" />

                <Footer />

                <div className="fixed bottom-6 right-6 z-[9999]">
                  <ModeToggle />
                </div>
              </div>
            </ThemeProvider>
          </AuthProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
