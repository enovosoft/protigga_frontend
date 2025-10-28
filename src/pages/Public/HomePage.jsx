import Footer from "@/components/Footer";
import Contact from "@/components/HomePage/Contact";
import FeaturedBooks from "@/components/HomePage/FeaturedBooks";
import FeaturedCourses from "@/components/HomePage/FeaturedCourses";
import Hero from "@/components/HomePage/Hero";
import InstructorList from "@/components/HomePage/InstructorList";
import Navbar from "@/components/Navbar";

export default function HomePage() {
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
