import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";

export const metadata: Metadata = {
  title: "Periscope — VC Intelligence",
  description: "AI-powered investment briefs for venture capital teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="min-h-screen pt-16">{children}</main>
      </body>
    </html>
  );
}
