"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 md:px-4 py-3  lg:px-8 rounded-md">
      {/* Background Blur */}
      <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#64748b12_1px,transparent_1px),linear-gradient(to_bottom,#64748b12_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" />

      <div className="container relative z-10 mx-auto flex min-h-screen items-center md:px-6 px-1">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden w-1/2 flex-col items-center justify-center lg:flex"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
          >
            <Image
              src="/images/Coder-Coding.svg"
              alt="Developer Coding"
              width={520}
              height={520}
              priority
            />
          </motion.div>

          <motion.h2
            className="mt-20 text-center text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Build Amazing
            <span className="block bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">
              Web Apps
            </span>
          </motion.h2>

          <p className="mt-4 max-w-lg text-center text-lg leading-8 text-slate-600 dark:text-slate-300">
            Create modern applications with{" "}
            <span className="font-semibold text-cyan-600 dark:text-cyan-400">
              Next.js
            </span>
            ,{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              React
            </span>
            , <span className="font-semibold text-orange-500">Firebase</span>,
            AI Chatbots & SaaS solutions.
          </p>

          {/* Floating Cards */}

          <motion.div
            className="absolute left-24 top-24 rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70"
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <p className="font-semibold text-slate-900 dark:text-white">
              ⚛️ React
            </p>
          </motion.div>

          <motion.div
            className="absolute bottom-32 left-60 rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <p className="font-semibold text-slate-900 dark:text-white">
              ▲ Next.js
            </p>
          </motion.div>

          <motion.div
            className="absolute right-16 top-40 rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70"
            animate={{ rotate: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <p className="font-semibold text-slate-900 dark:text-white">
              💻 Full Stack
            </p>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex w-full justify-center lg:w-1/2"
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 md:p-8 px-4 py-4  shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
