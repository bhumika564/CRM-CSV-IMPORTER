import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "GrowEasy CRM Importer - AI Powered CSV Extraction",
  description: "Intelligently extract CRM lead information from any valid CSV format with AI mapping and data normalization.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
