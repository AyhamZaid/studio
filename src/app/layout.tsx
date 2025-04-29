import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a fallback, adjust if needed
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'كتالوجات PDF تفاعلية', // Updated title in Arabic
  description: 'تصفح الكتالوجات التفاعلية بتنسيق PDF.', // Updated description in Arabic
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl"> {/* Set lang to 'ar' and dir to 'rtl' */}
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster component */}
      </body>
    </html>
  );
}
