import { Card, CardContent } from "@/components/ui/card";
import { INSTRUCTORS } from "@/config/data";
import { Award, BookOpen, GraduationCap, User, User2 } from "lucide-react";
import { motion } from "motion/react";
import ImageFallback from "../shared/ImageFallback";

export default function InstructorList() {
  return (
    <motion.section
      className="pt-16 md:pt-24 pb-4 md:pb-8 bg-secondary/10"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-semibold text-primary mb-4 font-primary hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            আমাদের এক্সপার্ট টিম
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg max-w-2xl mx-auto hover:text-foreground transition-colors duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            তোমার সেরা প্রস্তুতির জন্য আমাদের এক্সপার্ট ইন্সট্রাক্টরদের সাথে
            পরিচিত হও
          </motion.p>
        </div>

        {/* Instructor Grid */}
        <motion.div
          className="flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
        >
          {INSTRUCTORS.map((instructor) => (
            <Card
              key={instructor.id}
              className="group hover:shadow-xl transition-all duration-300 hover:border-secondary/50 overflow-hidden hover:scale-105 cursor-pointer"
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
        </motion.div>
      </div>
    </motion.section>
  );
}
