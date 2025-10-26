import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";
import apiInstance from "@/lib/api";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Document, Page, pdfjs } from "react-pdf";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// Set up PDF.js worker with CDN - matching react-pdf version
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function NotesViewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { note: noteFromState } = location.state || {};

  const [note, setNote] = useState(noteFromState || null);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2); // Start with a better default scale
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sideBySide, setSideBySide] = useState(false);
  const [pageDimensions, setPageDimensions] = useState(null);

  const goToPrevPage = useCallback(() => {
    if (sideBySide) {
      setPageNumber((prev) => Math.max(1, prev - 2));
    } else {
      setPageNumber((prev) => Math.max(1, prev - 1));
    }
  }, [sideBySide]);

  const goToNextPage = () => {
    if (sideBySide) {
      setPageNumber((prev) => Math.min(numPages - 1, prev + 2));
    } else {
      setPageNumber((prev) => Math.min(numPages, prev + 1));
    }
  };
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

    // Auto-disable dual mode on non-XL screens
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setSideBySide(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial size

    return () => window.removeEventListener("resize", handleResize);
  }, [slug, noteFromState, navigate]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    toast.error("Failed to load Note document");
    setLoading(false);
  };

  const onPageLoadSuccess = (page) => {
    // Store the actual page dimensions
    setPageDimensions({
      width: page.width,
      height: page.height,
      originalWidth: page.originalWidth,
      originalHeight: page.originalHeight,
    });
  };

  const fitToScreen = () => {
    const container = document.querySelector(".pdf-container");
    if (container && pageDimensions) {
      const containerWidth = container.clientWidth - 32;
      const pageWidth = pageDimensions.width;
      const autoScale = containerWidth / pageWidth;
      // Limit scale between 0.5 and 1.5 for readability
      const clampedScale = Math.min(1.5, Math.max(0.5, autoScale));
      setScale(clampedScale);
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
            <p className="text-muted-foreground whitespace-pre-wrap text-sm md:text-base">
              {note.note_desc}
            </p>
          </div>
        </div>

        {loading ? (
          <>
            {/* PDF Controls Skeleton */}
            <div className="bg-card p-4 rounded-lg border mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Navigation Skeleton */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>

                {/* Zoom / Rotate / Dual Controls Skeleton */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>

            {/* PDF Viewer Skeleton */}
            <div className="bg-card p-4 rounded-lg border overflow-hidden">
              <div className="flex justify-center">
                <div className="pdf-container flex gap-4 w-full max-w-full">
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex justify-center">
                      <div className="max-w-full">
                        <Skeleton className="h-96 w-full max-w-4xl mx-auto" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Input Skeleton */}
            <div className="mt-6 text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {" "}
            {/* PDF Controls */}
            <div className="bg-card p-4 rounded-lg border mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {sideBySide ? "Prev 2" : "Prev"}
                    </span>
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
                    <span className="hidden sm:inline">
                      {sideBySide ? "Next 2" : "Next"}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Zoom / Rotate / Dual Controls */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
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
                    onClick={fitToScreen}
                    title="Fit to screen"
                  >
                    Fit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={rotate}
                    className="gap-2"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Rotate</span>
                  </Button>

                  <Button
                    variant={sideBySide ? "default" : "outline"}
                    size="sm"
                    onClick={toggleSideBySide}
                    className="gap-2 hidden lg:inline"
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
                  className={`pdf-container flex gap-4 w-full max-w-full overflow-x-auto ${
                    sideBySide && numPages > 1
                      ? "xl:flex-row flex-col"
                      : "flex-col"
                  }`}
                >
                  <div
                    className={`flex-1 w-full min-w-0 ${
                      sideBySide
                        ? "xl:border-r xl:border-border xl:pr-4 border-none pr-0"
                        : ""
                    }`}
                  >
                    <div className="flex justify-center">
                      <div className="max-w-full overflow-x-auto">
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
                            onLoadSuccess={onPageLoadSuccess}
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
                  </div>
                  {sideBySide && numPages > pageNumber && (
                    <div className="flex-1 min-w-0">
                      <div className="max-w-full overflow-x-auto">
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
                            onLoadSuccess={onPageLoadSuccess}
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
                  )}
                </div>
              </div>
            </div>
            {/* Page Input */}
            <div className="mt-6 text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-2">
                <label htmlFor="page-input" className="text-sm">
                  Go to page:
                </label>
                <div className="flex items-center gap-2">
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
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
