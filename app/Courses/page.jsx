import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const courses = [
  {
    id: 1,
    title: "Full Stack Web Development",
    category: "Development",
    level: "Beginner to Advanced",
    students: "2.4K",
    duration: "12 Weeks",
    price: "$49",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  },
  {
    id: 2,
    title: "AI Chatbot Automation",
    category: "AI & Automation",
    level: "Intermediate",
    students: "1.8K",
    duration: "8 Weeks",
    price: "$39",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  },
  {
    id: 3,
    title: "Next.js SaaS Development",
    category: "SaaS Development",
    level: "Advanced",
    students: "1.2K",
    duration: "10 Weeks",
    price: "$59",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
  },
];

export default function CoursesPage() {
  return (
    <section className="border-b bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-primary">
              FEATURED COURSES
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Learn From Practical Courses
            </h2>

            <p className="mt-4 max-w-xl text-muted-foreground">
              Build real-world projects and develop skills that you can use in
              your career.
            </p>
          </div>

          <Button variant="outline" asChild>
            <Link href="/Courses">
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg p-0"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={75}
                  className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-md"
                />

                <Badge className="absolute left-4 top-4">
                  {course.category}
                </Badge>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold">{course.title}</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {course.level}
                </p>

                <div className="mt-5 flex items-center gap-5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4" />
                    {course.duration}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {course.students}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t px-6 py-4">
                <div>
                  <span className="text-xl font-bold">{course.price}</span>
                  <span className="ml-1 text-xs text-muted-foreground">
                    / course
                  </span>
                </div>

                <Button size="sm" asChild>
                  <Link href="/courses">View Course</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
