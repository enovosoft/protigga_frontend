import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ArrowLeft,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
// Set up PDF.js worker with CDN - matching react-pdf version
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function NotesViewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { note } = location.state || {};

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sideBySide, setSideBySide] = useState(false);

  useEffect(() => {
    if (!note) {
      toast.error("Note not found");
      navigate("/notes");
      return;
    }
    setLoading(false);

    // Auto-disable dual mode on non-XL screens
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setSideBySide(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial size

    return () => window.removeEventListener("resize", handleResize);
  }, [note, navigate]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    toast.error("Failed to load Note document");
    setLoading(false);
  };

  const goToPrevPage = () => {
    if (sideBySide) {
      setPageNumber((prev) => Math.max(1, prev - 2));
    } else {
      setPageNumber((prev) => Math.max(1, prev - 1));
    }
  };

  const goToNextPage = () => {
    if (sideBySide) {
      setPageNumber((prev) => Math.min(numPages - 1, prev + 2));
    } else {
      setPageNumber((prev) => Math.min(numPages, prev + 1));
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(2.0, prev + 0.1));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.1));
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const goBack = () => {
    navigate("/notes");
  };

  const toggleSideBySide = () => {
    // Only allow dual mode on XL screens (1280px+)
    if (window.innerWidth >= 1280) {
      setSideBySide(!sideBySide);
    }
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
            <p className="text-muted-foreground">{note.note_desc}</p>
          </div>
        </div>

        {loading ? (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <div className="mb-4">
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <div className="space-y-3">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex justify-center">
                <div className="w-full max-w-4xl">
                  <Skeleton className="h-64 w-full mb-4" />
                  <div className="flex justify-center gap-4">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {" "}
            {/* PDF Controls */}
            <div className="bg-card p-4 rounded-lg border mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {sideBySide ? "Prev 2" : "Prev"}
                  </Button>

                  <span className="text-sm px-3">
                    Page {pageNumber} of {numPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={pageNumber >= numPages}
                  >
                    {sideBySide ? "Next 2" : "Next"}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Zoom / Rotate / Dual Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={zoomOut}
                    disabled={scale <= 0.5}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>

                  <span className="text-sm px-2 min-w-[60px] text-center">
                    {Math.round(scale * 100)}%
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={zoomIn}
                    disabled={scale >= 2.0}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={rotate}
                    className="gap-2"
                  >
                    <RotateCw className="w-4 h-4" />
                    Rotate
                  </Button>

                  <Button
                    variant={sideBySide ? "default" : "outline"}
                    size="sm"
                    onClick={toggleSideBySide}
                    className={`gap-2 ${sideBySide ? "" : ""}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden xl:inline">
                      {sideBySide ? "Single" : "Dual"}
                    </span>
                    <span className="xl:hidden">Layout</span>
                  </Button>
                </div>
              </div>
            </div>
            {/* PDF Viewer */}
            <div className="bg-card p-4 rounded-lg border overflow-hidden">
              <div className="flex justify-center">
                <div
                  className={`flex gap-4 w-full max-w-full ${
                    sideBySide && numPages > 1
                      ? "xl:flex-row flex-col"
                      : "flex-col"
                  }`}
                >
                  <div
                    className={`flex-1 w-full ${
                      sideBySide
                        ? "xl:border-r xl:border-border xl:pr-4 border-none pr-0"
                        : ""
                    }`}
                  >
                    <div className="flex justify-center">
                      <Document
                        file={note.note_file_link}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                          <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                          </div>
                        }
                        error={
                          <div className="text-center py-8 h-64 flex items-center justify-center">
                            <div>
                              <p className="text-destructive mb-2">
                                Failed to load Note
                              </p>
                              <p className="text-sm text-muted-foreground">
                                The Note file could not be loaded. Please try
                                again later.
                              </p>
                            </div>
                          </div>
                        }
                      >
                        <Page
                          pageNumber={pageNumber}
                          scale={scale}
                          rotate={rotation}
                          loading={
                            <div className="flex justify-center items-center h-64">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                          }
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </Document>
                    </div>
                  </div>
                  {sideBySide && numPages > pageNumber && (
                    <div className="flex-1">
                      <Document
                        onLoadSuccess={() => {}}
                        onLoadError={() => {}}
                        file={note.note_file_link}
                        loading={
                          <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                          </div>
                        }
                        error={
                          <div className="text-center py-8 h-64 flex items-center justify-center">
                            <div>
                              <p className="text-destructive mb-2">
                                Failed to load Note
                              </p>
                              <p className="text-sm text-muted-foreground">
                                The Note file could not be loaded. Please try
                                again later.
                              </p>
                            </div>
                          </div>
                        }
                      >
                        <Page
                          pageNumber={pageNumber + 1}
                          scale={scale}
                          rotate={rotation}
                          loading={
                            <div className="flex justify-center items-center h-64">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                          }
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </Document>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Page Input */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2">
                <label htmlFor="page-input" className="text-sm">
                  Go to page:
                </label>
                <input
                  id="page-input"
                  type="number"
                  min={1}
                  max={numPages}
                  value={pageNumber}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= numPages) {
                      setPageNumber(page);
                    }
                  }}
                  className="w-16 px-2 py-1 text-sm border rounded"
                />
                <span className="text-sm text-muted-foreground">
                  of {numPages}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
