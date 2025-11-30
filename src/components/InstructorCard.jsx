import ImageFallback from "@/components/shared/ImageFallback";
import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, Globe } from "lucide-react";

export default function InstructorCard({ instructor }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 overflow-hidden">
      <CardContent className="p-0">
        {/* Instructor Image - Full width */}
        <div className="relative w-full aspect-square bg-muted">
          <ImageFallback
            src={instructor.image}
            alt={instructor.name}
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Instructor Info */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-1">
              {instructor.name}
            </h4>
            <p className="text-primary font-medium text-sm">
              {instructor.designation}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Award className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="truncate">
                {instructor.teaching_experience} experience
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="truncate">
                {instructor.student_count} students
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Globe className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="truncate text-xs">{instructor.academy}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
