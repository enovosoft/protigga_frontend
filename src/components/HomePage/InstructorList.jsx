import InstructorCard from "@/components/InstructorCard";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function InstructorList() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const response = await api.get("/instructors");
        if (response.data.success) {
          setInstructors(response.data.instructors || []);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
        toast.error("Failed to load instructors");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
        >
          {loading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="w-full aspect-[4/3] rounded-lg" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            ))
          ) : instructors.length > 0 ? (
            instructors.map((instructor) => (
              <InstructorCard
                key={instructor.instractor_id}
                instructor={instructor}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No instructors available</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
