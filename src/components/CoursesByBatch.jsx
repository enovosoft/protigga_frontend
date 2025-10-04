import { useState } from 'react';
import CourseCard from './CourseCard';
import { Button } from '@/components/ui/button';

const BATCH_TABS = [
  { id: 'hsc27', label: 'HSC 27' },
  { id: 'hsc26', label: 'HSC 26' },
  { id: 'ssc26', label: 'SSC 26' },
];

// Mock data - replace with actual API data
const MOCK_COURSES = {
  hsc27: [
    { id: 1, name: 'Physics Complete Course - HSC 27', price: 2500, thumbnail: null },
    { id: 2, name: 'Chemistry Crash Course - HSC 27', price: 2200, thumbnail: null },
    { id: 3, name: 'Mathematics Advanced - HSC 27', price: 2800, thumbnail: null },
    { id: 4, name: 'Biology Complete Guide - HSC 27', price: 2400, thumbnail: null },
  ],
  hsc26: [
    { id: 5, name: 'Physics Revision Course - HSC 26', price: 1800, thumbnail: null },
    { id: 6, name: 'Chemistry Final Prep - HSC 26', price: 1600, thumbnail: null },
    { id: 7, name: 'Mathematics Problem Solving - HSC 26', price: 2000, thumbnail: null },
    { id: 8, name: 'Biology Quick Review - HSC 26', price: 1700, thumbnail: null },
  ],
  ssc26: [
    { id: 9, name: 'Science Complete Course - SSC 26', price: 1500, thumbnail: null },
    { id: 10, name: 'Mathematics Foundation - SSC 26', price: 1400, thumbnail: null },
    { id: 11, name: 'English Language Skills - SSC 26', price: 1300, thumbnail: null },
    { id: 12, name: 'Bangla Literature - SSC 26', price: 1200, thumbnail: null },
  ],
};

export default function CoursesByBatch() {
  const [activeBatch, setActiveBatch] = useState('hsc27');

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-primary">
            কোর্স সমূহ
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from our comprehensive courses designed for different batches
          </p>
        </div>

        {/* Batch Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {BATCH_TABS.map((batch) => (
            <Button
              key={batch.id}
              variant={activeBatch === batch.id ? 'default' : 'outline'}
              size="lg"
              onClick={() => setActiveBatch(batch.id)}
              className="min-w-[120px] text-base"
            >
              {batch.label}
            </Button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_COURSES[activeBatch].map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="min-w-[200px]">
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
}
