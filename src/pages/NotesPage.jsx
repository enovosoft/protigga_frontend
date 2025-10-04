import { useState, useEffect } from "react";
import { FileText, Loader2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Dummy data for UI testing
const DUMMY_NOTES = [
  {
    id: 1,
    note_name: "Physics Chapter 1: Mechanics",
    note_desc:
      "Comprehensive notes on kinematics, dynamics, and energy concepts for HSC Physics preparation.",
  },
  {
    id: 2,
    note_name: "Chemistry Organic Reactions",
    note_desc:
      "Detailed explanation of organic chemistry reactions with examples and practice problems.",
  },
  {
    id: 3,
    note_name: "Mathematics Calculus Basics",
    note_desc:
      "Fundamental concepts of differential and integral calculus with solved examples.",
  },
  {
    id: 4,
    note_name: "Biology Cell Structure",
    note_desc:
      "Complete notes on cell biology including cell organelles and their functions.",
  },
  {
    id: 5,
    note_name: "English Grammar Rules",
    note_desc:
      "Essential grammar rules and practice exercises for HSC English examination.",
  },
  {
    id: 6,
    note_name: "Bangla Literature Analysis",
    note_desc:
      "Analysis of important Bangla literary works and their themes for HSC preparation.",
  },
];

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    // Simulate API loading delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Using dummy data for UI testing
    setNotes(DUMMY_NOTES);
    setIsLoading(false);
    // Comment out actual API call for now
    // try {
    //   const response = await axiosInstance.get('/notes');
    //   setNotes(response.data);
    // } catch (error) {
    //   toast.error('Failed to load notes');
    //   console.error('Error fetching notes:', error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleView = (noteId) => {
    // Navigate to note view or open in modal
    window.open(`/notes/${noteId}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Study Notes
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Access comprehensive study notes to enhance your learning
              experience
            </p>
          </div>

          {notes.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                No notes available at the moment
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <Card
                  key={note.id}
                  className="hover:shadow-lg transition-shadow flex flex-col"
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">
                          {note.note_name}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <CardDescription className="line-clamp-3">
                      {note.note_desc || "No description available"}
                    </CardDescription>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handleView(note.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
