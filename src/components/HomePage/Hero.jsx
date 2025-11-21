import { ArrowRight, BookOpen } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CountingNumber } from "../animation/counting-number";
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-accent/10 to-secondary/5 py-8 md:py-12 select-none">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            className="space-y-8 order-2 md:order-1"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-4">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-semibold text-primary leading-tight font-primary hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                স্বপ্ন পূরণের যাত্রা শুরু হোক এখান থেকেই
              </motion.h1>

              <motion.p
                className="text-base md:text-lg text-muted-foreground max-w-xl font-primary hover:text-foreground transition-colors duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              >
                <span className="text-secondary">
                  {" "}
                  College , HSC বা Admission
                </span>
                — যে কোনো পরীক্ষার সেরা প্রস্তুতির জন্য একটি নির্ভরযোগ্য
                প্ল্যাটফর্ম। ধাপে ধাপে শেখা, কনসেপ্ট ক্লিয়ার এবং প্র্যাকটিস—
                সবকিছুই এখানে! আজই শুরু করো তোমার আগামীর প্রস্তুতি।
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            >
              <Button
                asChild
                size="lg"
                className="text-base h-12 px-8 hover:scale-105 active:scale-95 transition-transform duration-200"
              >
                <Link to="/courses">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Courses
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outlineFill"
                className="text-base h-12 px-8 hover:scale-105 active:scale-95 transition-transform duration-200"
              >
                <Link to="/auth/register">
                  Start Learning Now
                  <ArrowRight className="ml-2 h-5 w-5 " />
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-6 pt-8 border-t border-border"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
            >
              <motion.div
                className="flex flex-col justify-center items-center hover:scale-110 transition-transform duration-300 cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
              >
                <CountingNumber
                  number={2000}
                  inView={true}
                  className="text-xl md:text-3xl font-bold text-primary"
                />
                <div className="text-sm text-muted-foreground">Students</div>
              </motion.div>
              <motion.div
                className="flex flex-col justify-center items-center hover:scale-110 transition-transform duration-300 cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.1 }}
              >
                <CountingNumber
                  number={30}
                  inView={true}
                  className="text-xl md:text-3xl font-bold text-primary"
                />
                <div className="text-sm text-muted-foreground">Courses</div>
              </motion.div>
              <motion.div
                className="flex flex-col justify-center items-center hover:scale-110 transition-transform duration-300 cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
              >
                <CountingNumber
                  number={95}
                  inView={true}
                  className="text-xl md:text-3xl font-bold text-primary"
                />

                <div className="text-sm text-muted-foreground">
                  Success Rate
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side - Hero Image */}
          <motion.div
            className="relative order-1 md:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative aspect-auto lg:aspect-auto rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <img
                src="/hero.jpg"
                alt="Hero Image"
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
