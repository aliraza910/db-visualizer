import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DB Visualizer Enterprise | Advanced SQL ER Diagram & Schema Architect",
  description: "Transform SQL DDL into stunning interactive ER diagrams. DB Visualizer Enterprise offers high-performance schema visualization, automated relationship detection, and professional database architecting tools.",
  keywords: "database visualizer, ER diagram generator, SQL to ER diagram, database schema tool, DDL visualizer, entity relationship diagram",
  openGraph: {
    title: "DB Visualizer Enterprise | Professional Database Visualization",
    description: "The ultimate tool for database engineers. Visualize complex SQL schemas and build DDL models with a premium interactive interface.",
    url: "https://db-visualizer.enterprise/",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
