import ImageFallback from "@/components/shared/ImageFallback";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function CourseCard({ course, className }) {
  const { thumbnail, course_title, price, slug, batch } = course;

  return (
    <Card
      className={cn(
        `group overflow-hidden hover:shadow-lg transition-shadow `,
        className
      )}
    >
      <Link
        className="w-full flex flex-col h-full min-h-[340px] lg:min-h-[380px]"
        to={`/courses/${slug}`}
      >
        <CardHeader className="p-0">
          <div className="relative w-full h-40 md:h-48 overflow-hidden bg-muted">
            <ImageFallback
              src={thumbnail}
              alt={course_title}
              className="group-hover:scale-105 transition-transform duration-300"
              icon={BookOpen}
              text="Course Thumbnail"
            />
            {/* Batch Tag */}
            {batch && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 bg-secondary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  <BookOpen className="w-3 h-3" />
                  {batch}
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 flex flex-col flex-1 ">
          <h3 className="text-base lg:text-lg font-medium text-foreground line-clamp-2">
            {course_title}
          </h3>

          <div className="flex items-center justify-between ">
            <span className="text-2xl font-medium text-primary">৳{price}</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button className="w-full">Enroll Now</Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
