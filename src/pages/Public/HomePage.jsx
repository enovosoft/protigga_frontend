import Footer from "@/components/Footer";
import Contact from "@/components/HomePage/Contact";
import FeaturedBooks from "@/components/HomePage/FeaturedBooks";
import FeaturedCourses from "@/components/HomePage/FeaturedCourses";
import Hero from "@/components/HomePage/Hero";
import InstructorList from "@/components/HomePage/InstructorList";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <>
      <Helmet>
        <title>প্রতিজ্ঞা - স্বপ্ন পূরণে | অনলাইন শিক্ষা প্ল্যাটফর্ম</title>
        <meta
          name="description"
          content="প্রতিজ্ঞা - বাংলাদেশের শীর্ষস্থানীয় অনলাইন শিক্ষা প্ল্যাটফর্ম। মানসম্পন্ন কোর্স, বই এবং শিক্ষামূলক সামগ্রী কিনুন। HSC, SSC এবং বিভিন্ন প্রতিযোগিতামূলক পরীক্ষার জন্য প্রস্তুতি নিন।"
        />
        <meta
          property="og:title"
          content="প্রতিজ্ঞা - স্বপ্ন পূরণে | অনলাইন শিক্ষা প্ল্যাটফর্ম"
        />
        <meta
          property="og:description"
          content="প্রতিজ্ঞা - বাংলাদেশের শীর্ষস্থানীয় অনলাইন শিক্ষা প্ল্যাটফর্ম। মানসম্পন্ন কোর্স, বই এবং শিক্ষামূলক সামগ্রী কিনুন।"
        />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="https://www.protigya.com/" />
        <link rel="canonical" href="https://www.protigya.com/" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <FeaturedCourses />
        <FeaturedBooks />
        <InstructorList />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
