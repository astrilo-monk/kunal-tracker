import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "DSA Tracker | Kunal Kushwaha",
  description: "A beautifully designed DSA practice tracker based on Kunal Kushwaha's curriculum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex bg-background text-foreground transition-colors duration-300">
        <Sidebar />
        <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
          <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
