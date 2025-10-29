import { useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { Button } from "../ui/button";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

import toast from "react-hot-toast";
import { Skeleton } from "../ui/skeleton";

function PDFViewer({
  link,
  isBasicControl = false,
  title = "PDF Document",
  initialScale = 1.2,
  disableScaling = false,
}) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(initialScale);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);
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
  const handleResize = () => {
    if (window.innerWidth < 1280) {
      setSideBySide(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    toast.error("Failed to load Note document");
  };

  const onPageLoadSuccess = (page) => {
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

  const toggleSideBySide = () => {
    // Only allow dual mode on XL screens (1280px+)
    if (window.innerWidth >= 1280) {
      setSideBySide(!sideBySide);
    }
  };

  if (loading) {
    return (
      <>
        {/* PDF Controls Skeleton */}
        <div className="bg-card p-3 sm:p-4 rounded-lg border mb-4 sm:mb-6">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            {/* Page Navigation Skeleton */}
            <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
              <Skeleton className="h-8 w-16 sm:w-20" />
              <Skeleton className="h-6 w-16 sm:w-20" />
              <Skeleton className="h-8 w-16 sm:w-20" />
            </div>

            {/* Zoom / Rotate / Dual Controls Skeleton */}
            <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2 flex-wrap">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-6 w-10 sm:w-12" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-16 sm:w-20" />
            </div>
          </div>
        </div>

        {/* PDF Viewer Skeleton */}
        <div className="bg-card p-2 sm:p-4 rounded-lg border overflow-hidden">
          <div className="flex justify-center">
            <div className="pdf-container flex gap-2 sm:gap-4 w-full max-w-full">
              <div className="flex-1 w-full min-w-0">
                <div className="flex justify-center">
                  <div className="max-w-full">
                    <Skeleton className="h-64 sm:h-96 w-full max-w-4xl mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Input Skeleton */}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <Skeleton className="h-4 w-16 sm:w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-14 sm:w-16" />
              <Skeleton className="h-4 w-8 sm:w-10" />
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <div>
      <div>
        {" "}
        {/* PDF Controls */}
        <div className="bg-card p-3 sm:p-4 rounded-lg border mb-4 sm:mb-6">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            {/* Page Navigation */}
            <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
              <Button
                size="sm"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                className="px-2 sm:px-3"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">
                  {sideBySide ? "Prev 2" : "Prev"}
                </span>
              </Button>

              <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-muted rounded text-center min-w-[80px] sm:min-w-[100px]">
                {pageNumber} / {numPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className="px-2 sm:px-3"
              >
                <span className="hidden sm:inline mr-1">
                  {sideBySide ? "Next 2" : "Next"}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Zoom / Rotate / Dual Controls */}
            <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2 flex-wrap">
              {!disableScaling && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={zoomOut}
                    disabled={scale <= 0.5}
                    className="px-2"
                  >
                    <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>

                  <span className="text-xs sm:text-sm px-1 sm:px-2 min-w-[40px] sm:min-w-[50px] text-center">
                    {Math.round(scale * 100)}%
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={zoomIn}
                    disabled={scale >= 2.0}
                    className="px-2"
                  >
                    <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={fitToScreen}
                title="Fit to screen"
                className="px-2 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Fit</span>
                <span className="sm:hidden">Fit</span>
              </Button>

              {!isBasicControl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rotate}
                  className="px-2"
                  title="Rotate"
                >
                  <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline ml-1">Rotate</span>
                </Button>
              )}

              {!isBasicControl && (
                <Button
                  variant={sideBySide ? "default" : "outline"}
                  size="sm"
                  onClick={toggleSideBySide}
                  className="px-2 hidden md:flex"
                  title={sideBySide ? "Single Page View" : "Dual Page View"}
                >
                  <LayoutGrid className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden lg:inline ml-1">
                    {sideBySide ? "Single" : "Dual"}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* PDF Viewer */}
        <div className="bg-card p-2 sm:p-4 rounded-lg border overflow-hidden">
          <div className="flex justify-center">
            <div
              className={`pdf-container flex gap-2 sm:gap-4 w-full max-w-full overflow-x-auto ${
                sideBySide && numPages > 1 ? "xl:flex-row flex-col" : "flex-col"
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
                      file={link}
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
                              Failed to load {title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              The {title} could not be loaded. Please try again
                              later.
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
                      file={link}
                      loading={
                        <div className="flex justify-center items-center h-64">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                      }
                      error={
                        <div className="text-center py-8 h-64 flex items-center justify-center">
                          <div>
                            <p className="text-destructive mb-2">
                              Failed to load Document
                            </p>
                            <p className="text-sm text-muted-foreground">
                              The Document file could not be loaded. Please try
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
        <div className="mt-4 sm:mt-6 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <label
              htmlFor="page-input"
              className="text-xs sm:text-sm font-medium"
            >
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
                className="w-14 sm:w-16 px-2 py-1 text-xs sm:text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <span className="text-xs sm:text-sm text-muted-foreground">
                of {numPages}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFViewer;
