const sections = [
  {
    id: 1,
    title: "Hero Section",
    subtitle: "Build Your Future With Coding",
    description:
      "Learn Web Development, AI, Chatbot Automation, and modern technologies through premium courses.",
    button: "Get Started",
  },
  {
    id: 2,
    title: "Featured Courses",
    subtitle: "Premium Learning",
    description:
      "Explore beginner to advanced courses with real-world projects and certificates.",
    button: "View Courses",
  },
  {
    id: 3,
    title: "Why Choose Us",
    subtitle: "Learn Smarter",
    description:
      "Expert instructors, practical projects, lifetime access, and community support.",
    button: "Learn More",
  },
  {
    id: 4,
    title: "Student Reviews",
    subtitle: "Success Stories",
    description:
      "Thousands of students have improved their skills and started successful careers.",
    button: "Read Reviews",
  },
  {
    id: 5,
    title: "Contact Us",
    subtitle: "Start Your Journey",
    description:
      "Have questions? Contact us today and begin your learning journey with confidence.",
    button: "Contact Now",
  },
];

export default function HomeSections() {
  return (
    <div className="bg-slate-950 text-white">
      {sections.map((section) => (
        <section
          key={section.id}
          className="py-24 border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-10 md:p-16 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-300">
              <span className="inline-block px-4 py-1 rounded-full bg-blue-600/20 text-blue-400 text-sm font-medium">
                {section.subtitle}
              </span>

              <h2 className="text-4xl md:text-6xl font-bold mt-6">
                {section.title}
              </h2>

              <p className="mt-6 max-w-2xl text-gray-300 text-lg leading-8">
                {section.description}
              </p>

              <button className="mt-8 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold">
                {section.button}
              </button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}