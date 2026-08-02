import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ModeToggle";
import Footer from "@/components/Footer";
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://your-domain.com"),
  title: {
    default: "LMS Skills Hub | Learn Web Development, AI & Programming",
    template: "%s | LMS Skills Hub",
  },
  description:
    "LMS Skills Hub is a modern online learning platform offering premium courses in Web Development, React, Next.js, JavaScript, AI, Chatbot Automation, Firebase, and more. Learn with practical projects, expert guidance, and career-focused content.",

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
    "Coding Bootcamp",
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

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen  antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>

            <Footer />

            {/* Floating Theme Toggle */}
            <div className="fixed bottom-6 right-6 z-[9999]">
              <ModeToggle />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
