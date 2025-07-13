import type { Metadata } from "next";
import { Geist, Geist_Mono, Karla } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import ReduxProvider from "./ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CineVerse",
  description: "Your go-to platform for movie suggestions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${karla.variable} antialiased`}
        style={{ fontFamily: 'var(--font-karla), sans-serif' }}
      >
        <ReduxProvider>
          <Suspense>{children}</Suspense>
        </ReduxProvider>
      </body>
    </html>
  );
}
