'use client';

import type React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Set worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface FlipbookViewerProps {
  fileUrl: string;
}

const FlipbookViewer: React.FC<FlipbookViewerProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setContainerWidth(node.getBoundingClientRect().width);
    }
  }, []);

   // Adjust width on resize
   useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('pdf-viewer-container');
      if (container) {
        setContainerWidth(container.getBoundingClientRect().width);
      }
    };
    window.addEventListener('resize', handleResize);
    // Initial width set
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const onDocumentLoadSuccess = ({ numPages: nextNumPages }: { numPages: number }) => {
    setNumPages(nextNumPages);
    setIsLoading(false);
     // Reset to page 1 if the document changes
     if (pageNumber > nextNumPages) {
        setPageNumber(1);
    }
  };

   const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    setIsLoading(false);
    toast({
        title: "خطأ",
        description: `حدث خطأ أثناء تحميل ملف PDF: ${error.message}`,
        variant: "destructive",
      });
    // Optionally set an error state to display a message in the component
  };

  const goToPreviousPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 2, 1)); // Go back 2 pages for double view
  };

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 2, numPages || 1)); // Go forward 2 pages for double view
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPreviousPage();
      } else if (event.key === 'ArrowRight') {
        goToNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [numPages]); // Re-add listener if numPages changes


  // Calculate widths for double page view
  const pageDisplayWidth = containerWidth ? (containerWidth / 2) - 16 : undefined; // Subtract padding/gap
  const showDoublePage = containerWidth ? containerWidth > 768 : false; // Example breakpoint

  return (
    <div id="pdf-viewer-container" ref={containerRef} className="w-full h-full flex flex-col items-center justify-center bg-muted/20 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80">
          <div className="flex flex-col items-center space-y-4 p-8">
             <Skeleton className="h-[80%] w-[80vw] max-w-3xl rounded-md" />
             <p>جاري تحميل الكتالوج...</p>
           </div>
        </div>
      )}
      <div className="flex-grow w-full overflow-auto p-4 flex justify-center items-start">
         <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<Skeleton className="h-[80vh] w-[80vw] max-w-3xl rounded-md" />} // More specific loading skeleton
            error={ <div className="text-destructive text-center p-4">فشل تحميل ملف PDF.</div> }
            className="flex justify-center items-start"
          >
          <div className={`flex gap-1 ${showDoublePage ? '' : 'flex-col items-center'}`}>
              {/* Render current page */}
              <Page
                key={`page_${pageNumber}`}
                pageNumber={pageNumber}
                width={showDoublePage ? pageDisplayWidth : containerWidth ? containerWidth - 32 : undefined} // Adjust width based on view
                renderTextLayer={false} // Improve performance if text selection isn't needed
                renderAnnotationLayer={false} // Improve performance if annotations aren't needed
                loading={<Skeleton className={`rounded-md ${showDoublePage ? 'h-[80vh]' : 'h-[60vh]'} w-full`} />}
                className="shadow-md mb-1"
              />
              {/* Render next page in double view if possible */}
               {showDoublePage && pageNumber + 1 <= (numPages ?? 0) && (
                 <Page
                   key={`page_${pageNumber + 1}`}
                   pageNumber={pageNumber + 1}
                   width={pageDisplayWidth}
                   renderTextLayer={false}
                   renderAnnotationLayer={false}
                   loading={<Skeleton className="h-[80vh] w-full rounded-md" />}
                   className="shadow-md"
                 />
               )}
          </div>

         </Document>
      </div>


      {numPages && !isLoading && (
         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-4 p-2 bg-background/80 rounded-full shadow-md">
            <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousPage}
                disabled={pageNumber <= 1}
                aria-label="الصفحة السابقة"
             >
              <ChevronRight className="h-6 w-6" /> {/* Icon flipped for RTL */}
            </Button>
            <p className="text-sm font-medium text-foreground">
              صفحة {pageNumber}{showDoublePage && pageNumber + 1 <= numPages ? `-${pageNumber+1}` : ''} من {numPages}
            </p>
            <Button
                variant="ghost"
                size="icon"
                onClick={goToNextPage}
                disabled={pageNumber >= (numPages - (showDoublePage ? 1 : 0))}
                aria-label="الصفحة التالية"
            >
               <ChevronLeft className="h-6 w-6" /> {/* Icon flipped for RTL */}
            </Button>
          </div>
        )}
    </div>
  );
};

export default FlipbookViewer;
