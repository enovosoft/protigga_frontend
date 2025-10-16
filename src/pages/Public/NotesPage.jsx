import { useState, useEffect } from "react";
import {
  FileText,
  Loader2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import apiInstance from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await apiInstance.get("/notes");
      setNotes(response.data?.notes || []);
    } catch (error) {
      toast.error("Failed to load notes");
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (note) => {
    // Navigate to note view page with note data in state
    navigate("/notes/view", { state: { note } });
  };

  // Pagination logic
  const totalPages = Math.ceil(notes.length / notesPerPage);
  const startIndex = (currentPage - 1) * notesPerPage;
  const paginatedNotes = notes.slice(startIndex, startIndex + notesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card p-6 rounded-lg border">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary font-primary mb-2">
                প্রতিজ্ঞা Notes
              </h1>
              <p className="text-muted-foreground">
                Access comprehensive study notes for your HSC preparation
              </p>
            </div>

            {notes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Notes Available
                </h3>
                <p className="text-muted-foreground">
                  Notes will be available soon. Please check back later.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedNotes.map((note) => (
                    <Card
                      key={note.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {note.note_name}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {note.note_desc}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => handleView(note)}
                          className="w-full gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Note
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
