import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-accent/10 to-secondary/5 py-8 md:py-12 select-none">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8 order-2 md:order-1">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-primary leading-tight font-primary">
                স্বপ্ন পূরণের যাত্রা শুরু হোক এখান থেকেই
              </h1>

              <p className="text-base md:text-lg text-muted-foreground max-w-xl font-primary">
                <span className="text-secondary">
                  {" "}
                  College , HSC বা Admission
                </span>
                — যে কোনো পরীক্ষার{" "}
                <span className="text-secondary">Physics এবং ICT</span>{" "}
                প্রস্তুতির জন্য একটি নির্ভরযোগ্য প্ল্যাটফর্ম। ধাপে ধাপে শেখা,
                কনসেপ্ট ক্লিয়ার এবং প্র্যাকটিস— সবকিছুই এখানে! আজই শুরু করো
                তোমার আগামীর প্রস্তুতি।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base h-12 px-8">
                <Link to="/courses">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Courses
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outlineFill"
                className="text-base h-12 px-8"
              >
                <Link to="/auth/register">
                  Start Learning Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border ">
              <div className="flex flex-col justify-center items-center">
                <div className="text-xl md:text-3xl font-bold text-primary">
                  10,000+
                </div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="text-xl md:text-3xl font-bold text-primary">
                  30+
                </div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="text-xl md:text-3xl font-bold text-primary">
                  95%
                </div>
                <div className="text-sm text-muted-foreground">
                  Success Rate
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="relative order-1 md:order-2 ">
            <div className="relative aspect-auto lg:aspect-auto  rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/hero.jpg"
                alt="Hero Image"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
