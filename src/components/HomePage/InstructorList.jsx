import { Card, CardContent } from "@/components/ui/card";
import { INSTRUCTORS } from "@/config/data";
import { Award, BookOpen, GraduationCap, User, User2 } from "lucide-react";
import ImageFallback from "../shared/ImageFallback";

export default function InstructorList() {
  return (
    <section className="pt-16 md:pt-24 pb-4 md:pb-8 bg-secondary/10">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-4 font-primary">
            আমাদের এক্সপার্ট টিম
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            তোমার সেরা প্রস্তুতির জন্য আমাদের এক্সপার্ট ইন্সট্রাক্টরদের সাথে
            পরিচিত হও
          </p>
        </div>

        {/* Instructor Grid */}
        <div className="flex flex-wrap justify-center gap-6">
          {INSTRUCTORS.map((instructor) => (
            <Card
              key={instructor.id}
              className="group hover:shadow-xl transition-all duration-300 hover:border-secondary/50 overflow-hidden"
            >
              <CardContent className="p-6">
                {/* Instructor Image */}
                <div className="mb-4">
                  <div className="relative w-32 h-32 mx-auto">
                    {instructor.image ? (
                      <ImageFallback
                        src={instructor.image}
                        alt={instructor.name}
                        className="w-full h-full rounded-full object-cover border-4 border-secondary/20 group-hover:border-secondary/40 transition-colors"
                        icon={User2}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-4 border-secondary/20 group-hover:border-secondary/40 transition-colors">
                        <User className="w-16 h-16 text-primary/60" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="text-center space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-secondary transition-colors">
                      {instructor.name}
                    </h3>
                    <p className="text-secondary font-medium">
                      {instructor.subject}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-border">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="w-4 h-4 text-secondary" />
                      <span>{instructor.institution}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Award className="w-4 h-4 text-secondary" />
                      <span>{instructor.experience} experience</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4 text-secondary" />
                      <span>{instructor.students}+ students</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
