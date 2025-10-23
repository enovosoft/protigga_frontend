import StudentDashboardLayout from "@/components/shared/StudentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/VideoPlayer";
import { useStoreActions, useStoreState } from "easy-peasy";
import { ChevronDown, ChevronRight, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
export default function CoursePage() {
  const location = useLocation();
  const slug = location.state?.slug;

  const { course, loading } = useStoreState((state) => state.student);
  const { fetchCourseDetails } = useStoreActions((actions) => actions.student);

  const [expandedChapters, setExpandedChapters] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    if (slug && !course) {
      fetchCourseDetails(slug);
    }
  }, [slug, course, fetchCourseDetails]);

  // Set default expanded chapter and selected topic
  useEffect(() => {
    if (course?.chapters?.length > 0) {
      const firstChapter = course.chapters[0];

      // Expand first chapter by default
      setExpandedChapters((prev) => ({
        ...prev,
        [firstChapter.chapter_id]: true,
      }));

      // Select first topic if available and no topic is selected
      if (!selectedTopic && firstChapter.topics?.length > 0) {
        setSelectedTopic(firstChapter.topics[0]);
      }
    }
  }, [course, selectedTopic]);

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  // Get all topics in order for navigation
  const getAllTopics = () => {
    if (!course?.chapters) return [];

    const allTopics = [];
    course.chapters.forEach((chapter) => {
      if (chapter.topics) {
        chapter.topics.forEach((topic) => {
          allTopics.push(topic);
        });
      }
    });
    return allTopics;
  };

  const getCurrentTopicIndex = () => {
    if (!selectedTopic) return -1;
    const allTopics = getAllTopics();
    return allTopics.findIndex(
      (topic) => topic.chapter_topic_id === selectedTopic.chapter_topic_id
    );
  };

  const handleNextTopic = () => {
    const allTopics = getAllTopics();
    const currentIndex = getCurrentTopicIndex();

    if (currentIndex >= 0 && currentIndex < allTopics.length - 1) {
      const nextTopic = allTopics[currentIndex + 1];
      setSelectedTopic(nextTopic);

      // Find and expand the chapter containing the next topic
      const nextChapter = course.chapters.find((chapter) =>
        chapter.topics?.some(
          (topic) => topic.chapter_topic_id === nextTopic.chapter_topic_id
        )
      );
      if (nextChapter) {
        setExpandedChapters((prev) => ({
          ...prev,
          [nextChapter.chapter_id]: true,
        }));
      }
    }
  };

  const handlePreviousTopic = () => {
    const allTopics = getAllTopics();
    const currentIndex = getCurrentTopicIndex();

    if (currentIndex > 0) {
      const previousTopic = allTopics[currentIndex - 1];
      setSelectedTopic(previousTopic);

      // Find and expand the chapter containing the previous topic
      const previousChapter = course.chapters.find((chapter) =>
        chapter.topics?.some(
          (topic) => topic.chapter_topic_id === previousTopic.chapter_topic_id
        )
      );
      if (previousChapter) {
        setExpandedChapters((prev) => ({
          ...prev,
          [previousChapter.chapter_id]: true,
        }));
      }
    }
  };

  const hasNextTopic = () => {
    const currentIndex = getCurrentTopicIndex();
    const allTopics = getAllTopics();
    return currentIndex >= 0 && currentIndex < allTopics.length - 1;
  };

  const hasPreviousTopic = () => {
    const currentIndex = getCurrentTopicIndex();
    return currentIndex > 0;
  };

  if (loading) {
    return (
      <StudentDashboardLayout>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Navigation Skeleton */}
          <div className="lg:col-span-1 order-3 lg:order-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-6 w-48" />
              </CardContent>
            </Card>
          </div>
        </div>
      </StudentDashboardLayout>
    );
  }

  if (!course) {
    return (
      <StudentDashboardLayout>
        <p className="text-muted-foreground">Course not found.</p>
      </StudentDashboardLayout>
    );
  }

  return (
    <StudentDashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Navigation - Chapters and Topics */}
        <div className="lg:col-span-1 order-3 lg:order-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Course Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {course.chapters?.map((chapter) => (
                <Collapsible
                  key={chapter.chapter_id}
                  open={expandedChapters[chapter.chapter_id]}
                  onOpenChange={() => toggleChapter(chapter.chapter_id)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted rounded-lg transition-colors">
                    <span className="font-medium text-left text-sm">
                      {chapter.title}
                    </span>
                    {expandedChapters[chapter.chapter_id] ? (
                      <ChevronDown className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pl-4">
                    {chapter.topics?.map((topic) => (
                      <div
                        key={topic.chapter_topic_id}
                        className={`flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer transition-colors ${
                          selectedTopic?.chapter_topic_id ===
                          topic.chapter_topic_id
                            ? "bg-primary/10 text-primary"
                            : ""
                        }`}
                        onClick={() => handleTopicSelect(topic)}
                      >
                        <Play className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm truncate">{topic.title}</span>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <Card>
            <CardHeader>
              <CardTitle>{course.course_title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4  p-1 lg:p-4">
              {/* Video Content Area */}
              <VideoPlayer
                url={selectedTopic?.youtube_url}
                title={selectedTopic?.title}
                onNext={handleNextTopic}
                onPrevious={handlePreviousTopic}
                hasNext={hasNextTopic()}
                hasPrevious={hasPreviousTopic()}
              />

              {/* Topic Title and Description */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-2">
                  {selectedTopic
                    ? selectedTopic.title
                    : "Select a topic to view content"}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentDashboardLayout>
  );
}
