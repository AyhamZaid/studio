'use client';

import type React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import the Flipbook component to avoid SSR issues with react-pdf
const FlipbookViewer = dynamic(() => import('@/components/flipbook-viewer'), {
  ssr: false,
  loading: () => <p className="text-center p-4">جاري تحميل العارض...</p>,
});

interface CatalogItem {
  title: string;
  file: string;
  cover: string;
}

// Mock catalog data - replace with your actual PDF paths or fetch from an API
const pdfList: CatalogItem[] = [
  { title: "كتالوج 1", file: "/AceHacker-Syllabus.pdf", cover: "https://fanutrition.pl/fa__billionaire_en/files/thumb/0.jpg" },
  { title: "كتالوج 2", file: "/235_7-English-Grammar-in-Use.-Murphy-R.-2019-5th-394p-.pdf", cover: "https://fanutrition.pl/fa__core_en/files/thumb/0.jpg" },
  { title: "كتالوج 3", file: "/catalog3.pdf", cover: "https://fanutrition.pl/fa__bad_ass_en/files/thumb/1.jpg" },
  // Add more catalogs as needed
];

export default function Home() {
  const [selectedPdf, setSelectedPdf] = useState<CatalogItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCatalog = (pdf: CatalogItem) => {
    setSelectedPdf(pdf);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPdf(null); // Clear selected PDF when closing modal
  };

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-center mb-8">📚 كتالوجات PDF تفاعلية</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pdfList.map((item) => (
          <Card
            key={item.title}
            className="overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 shadow-md hover:shadow-lg bg-card text-card-foreground rounded-lg border"
            onClick={() => openCatalog(item)}
            role="button"
            tabIndex={0}
            aria-label={`فتح ${item.title}`}
            onKeyDown={(e) => e.key === 'Enter' && openCatalog(item)}
          >
            <CardHeader className="p-0">
              <Image
                src={item.cover || `https://picsum.photos/seed/${item.title}/400/300`} // Fallback placeholder
                alt={item.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover" // Adjusted height
                priority={pdfList.indexOf(item) < 4} // Prioritize loading first few images
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg font-semibold truncate">{item.title}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col overflow-hidden">
         <DialogHeader className="p-4 border-b flex flex-row justify-between items-center">
            <DialogTitle>{selectedPdf?.title}</DialogTitle>
            <DialogClose asChild>
               <Button variant="ghost" size="icon" onClick={closeModal} aria-label="إغلاق">
                 <X className="h-6 w-6" />
               </Button>
            </DialogClose>
          </DialogHeader>

          <div className="flex-grow overflow-auto relative">
            {selectedPdf && <FlipbookViewer fileUrl={selectedPdf.file} />}
          </div>

        </DialogContent>
      </Dialog>
    </main>
  );
}
