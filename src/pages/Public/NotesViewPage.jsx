import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PDFViewer from "@/components/shared/PDFViewer";
import { Button } from "@/components/ui/button";

import apiInstance from "@/lib/api";
import { ArrowLeft } from "lucide-react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// Set up PDF.js worker with CDN - matching react-pdf version

export default function NotesViewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { note: noteFromState } = location.state || {};

  const [note, setNote] = useState(noteFromState || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      if (!slug) {
        toast.error("Note not found");
        navigate("/notes");
        return;
      }

      // If note is already available from state, use it
      if (noteFromState) {
        setNote(noteFromState);
        setLoading(false);
        return;
      }

      // Otherwise, fetch from API
      try {
        setLoading(true);
        const response = await apiInstance.get(`/notes/${slug}`);
        if (response.data?.note) {
          setNote(response.data.note);
        } else {
          throw new Error("Note not found");
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Note not found");
        navigate("/notes");
        return;
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [slug, noteFromState, navigate]);

  const goBack = () => {
    navigate("/notes");
  };

  if (!note) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="outline" onClick={goBack} className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Notes
          </Button>

          <div className="bg-card p-6 rounded-lg border">
            <h1 className="text-2xl font-bold mb-2">{note.note_name}</h1>
            <p className="text-muted-foreground whitespace-pre-wrap text-sm md:text-base">
              {note.note_desc}
            </p>
          </div>
        </div>
        {/* PDF Viewer */}

        <PDFViewer link={note.note_file_link} title="Note" />
      </div>
      <Footer />
    </div>
  );
}
