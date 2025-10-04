import { Card, CardContent } from '@/components/ui/card';
import { User, Award, BookOpen } from 'lucide-react';

// Mock data - replace with actual API data
const INSTRUCTORS = [
  {
    id: 1,
    name: 'Dr. Ahmed Rahman',
    subject: 'Physics',
    experience: '15 years',
    students: 2000,
    image: null,
  },
  {
    id: 2,
    name: 'Prof. Fatima Khatun',
    subject: 'Chemistry',
    experience: '12 years',
    students: 1800,
    image: null,
  },
  {
    id: 3,
    name: 'Md. Karim Hossain',
    subject: 'Mathematics',
    experience: '10 years',
    students: 2200,
    image: null,
  },
  {
    id: 4,
    name: 'Dr. Nusrat Jahan',
    subject: 'Biology',
    experience: '14 years',
    students: 1900,
    image: null,
  },
];

export default function InstructorList() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-accent/10 to-secondary/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-primary">
            আমাদের শিক্ষকমণ্ডলী
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn from experienced educators dedicated to your success
          </p>
        </div>

        {/* Instructor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      <img
                        src={instructor.image}
                        alt={instructor.name}
                        className="w-full h-full rounded-full object-cover border-4 border-secondary/20 group-hover:border-secondary/40 transition-colors"
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
                    <p className="text-secondary font-medium">{instructor.subject}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-border">
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
