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
        `overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col `,
        className
      )}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden bg-muted">
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

      <CardContent className="p-6 flex flex-col flex-grow">
        <h3 className="text-base lg:text-lg font-medium text-foreground line-clamp-2">
          {course_title}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-medium text-primary">৳{price}</span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 mt-auto">
        <Link className="w-full" to={`/courses/${slug}`}>
          <Button className="w-full">Enroll Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
