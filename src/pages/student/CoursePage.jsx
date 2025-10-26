import StudentDashboardLayout from "@/components/shared/StudentDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/VideoPlayer";
import { useStoreActions, useStoreState } from "easy-peasy";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Play,
  Video,
  Check,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
export default function CoursePage() {
  const location = useLocation();
  const slug = location.state?.slug;

  const { course, loading } = useStoreState((state) => state.student);
  const { fetchCourseDetails } = useStoreActions((actions) => actions.student);

  const [expandedChapters, setExpandedChapters] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [videoProgress, setVideoProgress] = useState({});

  useEffect(() => {
    if ((slug && !course) || slug !== course?.slug) {
      fetchCourseDetails(slug);
    }
  }, [slug, course, fetchCourseDetails]);

  // Load video progress for all topics
  const loadVideoProgress = useCallback(() => {
    if (course?.chapters && slug) {
      const progress = {};
      course.chapters.forEach(chapter => {
        if (chapter.topics) {
          chapter.topics.forEach(topic => {
            const saved = localStorage.getItem(`video_progress_${slug}_${topic.chapter_topic_id}`);
            if (saved) {
              progress[topic.chapter_topic_id] = JSON.parse(saved);
            }
          });
        }
      });
      setVideoProgress(progress);
    }
  }, [course, slug]);

  useEffect(() => {
    if (course?.chapters?.length > 0) {
      loadVideoProgress();
    }
  }, [course, slug, loadVideoProgress]);

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
                <Clapperboard className="w-5 h-5" />
                Course Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-2">
              {course.chapters?.map((chapter, chapterIndex) => (
                <Collapsible
                  key={chapter.chapter_id}
                  open={expandedChapters[chapter.chapter_id]}
                  onOpenChange={() => toggleChapter(chapter.chapter_id)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-accent/50 rounded-xl transition-all duration-200 border border-transparent hover:border-border/50 group">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <Play className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-bold text-left text-sm text-foreground group-hover:text-primary transition-colors truncate">
                        {chapter.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {chapter.topics?.length || 0} lectures
                      </span>
                      {expandedChapters[chapter.chapter_id] ? (
                        <ChevronDown className="w-4 h-4 flex-shrink-0 text-primary" />
                      ) : (
                        <ChevronRight className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 pl-4 pt-2 pb-2">
                    {chapter.topics?.map((topic, topicIndex) => {
                      // Calculate global topic number
                      let globalTopicNumber = 1;
                      for (let i = 0; i < chapterIndex; i++) {
                        globalTopicNumber +=
                          course.chapters[i].topics?.length || 0;
                      }
                      globalTopicNumber += topicIndex;

                      const isSelected =
                        selectedTopic?.chapter_topic_id ===
                        topic.chapter_topic_id;

                      const topicProgress = videoProgress[topic.chapter_topic_id];
                      const isCompleted = topicProgress?.completed;
                      const progressPercent = topicProgress?.progress || 0;

                      return (
                        <div
                          key={topic.chapter_topic_id}
                          className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 group border ${
                            isSelected
                              ? "bg-primary/15 border-primary/20 shadow-md ring-1 ring-primary/10"
                              : "hover:bg-accent/40 hover:border-accent/60 border-transparent hover:shadow-sm"
                          }`}
                          onClick={() => handleTopicSelect(topic)}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Video
                                className={`w-4 h-4 transition-colors duration-200 ${
                                  isSelected
                                    ? "text-primary"
                                    : isCompleted
                                    ? "text-green-600"
                                    : "text-muted-foreground group-hover:text-primary"
                                }`}
                              />
                              <span
                                className={`text-sm font-semibold transition-colors duration-200 ${
                                  isSelected
                                    ? "text-primary"
                                    : isCompleted
                                    ? "text-green-600"
                                    : "text-foreground group-hover:text-primary"
                                }`}
                              >
                                {globalTopicNumber}.
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <span
                                className={`text-sm font-medium block truncate transition-colors duration-200 ${
                                  isSelected
                                    ? "text-primary"
                                    : isCompleted
                                    ? "text-green-600"
                                    : "text-foreground group-hover:text-primary"
                                }`}
                              >
                                {topic.title}
                              </span>
                              {/* Progress bar */}
                              {progressPercent > 0 && !isCompleted && (
                                <div className="w-full bg-muted rounded-full h-1 mt-1">
                                  <div
                                    className="bg-primary h-1 rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercent * 100}%` }}
                                  ></div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isCompleted && (
                              <Check className="w-4 h-4 text-green-600" />
                            )}
                            {isSelected && (
                              <Play className="w-3 h-3 text-primary fill-primary" />
                            )}
                          </div>
                        </div>
                      );
                    })}
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
                key={selectedTopic?.chapter_topic_id || "no-topic"}
                url={selectedTopic?.youtube_url}
                title={selectedTopic?.title}
                courseSlug={slug}
                topicId={selectedTopic?.chapter_topic_id}
                onProgressUpdate={() => {
                  // Refresh progress indicators
                  loadVideoProgress();
                }}
              />

              {/* Navigation Controls */}
              <div className="flex items-center justify-between gap-3 pt-3">
                <Button
                  onClick={handlePreviousTopic}
                  disabled={!hasPreviousTopic()}
                  variant="outline"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Previous <span className="hidden md:inline">Lecture</span>
                  </span>
                </Button>

                <Button onClick={handleNextTopic} disabled={!hasNextTopic()}>
                  <span className="text-sm font-medium">
                    Next <span className="hidden md:inline">Lecture</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

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
