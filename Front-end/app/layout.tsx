import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import Providers from "../components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillSync AI",
  description: "AI-powered resume matcher and job assistant",
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
