import ImageFallback from "@/components/shared/ImageFallback";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  const { thumbnail, name, price, slug, batch } = course;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <ImageFallback
            src={thumbnail}
            alt={name}
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

      <CardContent className="p-6 flex-grow">
        <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
          {name}
        </h3>
        <div className="flex items-center justify-between">
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
