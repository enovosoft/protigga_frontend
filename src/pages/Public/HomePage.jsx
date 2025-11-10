import Footer from "@/components/Footer";
import Contact from "@/components/HomePage/Contact";
import FeaturedBooks from "@/components/HomePage/FeaturedBooks";
import FeaturedCourses from "@/components/HomePage/FeaturedCourses";
import Hero from "@/components/HomePage/Hero";
import InstructorList from "@/components/HomePage/InstructorList";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedCourses />
      <FeaturedBooks />
      <InstructorList />
      <Contact />
      <Footer />
    </div>
  );
}
