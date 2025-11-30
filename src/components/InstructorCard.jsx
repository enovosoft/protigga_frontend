import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, Globe } from "lucide-react";

export default function InstructorCard({ instructor }) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:border-secondary/50 overflow-hidden hover:scale-105 cursor-pointer">
      <CardContent className="p-4 sm:p-6">
        {/* Instructor Image */}
        <div className="mb-3 sm:mb-4">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto">
            <Avatar className="w-full h-full border-4 border-secondary/20 group-hover:border-secondary/40 transition-colors">
              <AvatarImage
                src={instructor.image}
                alt={instructor.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary/60 text-lg sm:text-xl">
                {instructor.name?.charAt(0)?.toUpperCase() || "I"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Instructor Info */}
        <div className="text-center space-y-2 sm:space-y-3">
          <div>
            <h4 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-secondary transition-colors">
              {instructor.name}
            </h4>
            <p className="text-secondary font-medium text-sm">
              {instructor.designation}
            </p>
          </div>

          <div className="space-y-1 sm:space-y-2 pt-2 sm:pt-3 border-t border-border">
            <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 text-secondary flex-shrink-0" />
              <span>{instructor.teaching_experience} experience</span>
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-secondary flex-shrink-0" />
              <span>{instructor.student_count} students</span>
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-secondary flex-shrink-0" />
              <span className="text-xs">{instructor.academy}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
