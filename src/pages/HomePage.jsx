import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CoursesByBatch from '@/components/CoursesByBatch';
import InstructorList from '@/components/InstructorList';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <CoursesByBatch />
      <InstructorList />
      <Footer />
    </div>
  );
}
