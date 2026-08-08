import { Button } from "@/components/ui/button";

export default function MyCoursesPage() {
  return (
    <div className="flex  items-center justify-between py-2">
      <h1 className="text-4xl font-bold mb-4">My Courses</h1>
      <Button variant="default" className="py-5 px-4 text-sm font-semibold">
        Enroll in a Course
      </Button>
    </div>
  );
}
