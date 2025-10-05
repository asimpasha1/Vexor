import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import DynamicMetadata from "@/components/DynamicMetadata";
import FloatingChatButton from "@/components/support/FloatingChatButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: "DigitalMarket - Premium Digital Products",
  description: "Discover high-quality digital products including e-books, courses, templates, and software. Your premier destination for digital innovation.",
  keywords: "digital products, e-books, online courses, templates, software, marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider defaultTheme="light" enableSystem>
          <AuthProvider>
            <ToastProvider>
              <DynamicMetadata />
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-16">
                  {children}
                </main>
                <Footer />
              </div>
              <FloatingChatButton />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
