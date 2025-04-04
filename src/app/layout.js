import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "../components/ui/toaster";
import { BrowserRouter } from "react-router-dom";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  keywords: [
    "Learning Destiny",
    "online tech courses",
    "learn programming online",
    "web development courses",
    "AI and machine learning courses",
    "cybersecurity training",
  ],
  title: {
    default: "Learning Destiny",
    template: "%s - Learning Destiny",
  },
  openGraph: {
    title: "Learning Destiny - Empowering Education",
    description:
      "Unlock your potential with Learning Destiny's courses, workshops, and events.",
    url: "https://learningdestiny.in",
    type: "website",
    images: [
      {
        url: "https://learningdestiny.in/HomeBG.png",
        width: 1200,
        height: 630,
        alt: "Learning Destiny Banner",
      },
    ],
  },
  description:
    "Unlock your potential with Learning Destiny's courses, workshops, and events.",
  twitter: {
    card: "summary_large_image",
    title: "Learning Destiny - Empowering Education",
    description:
      "Unlock your potential with Learning Destiny's courses, workshops, and events.",
    images: ["https://learningdestiny.in/HomeBG.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    // <BrowserRouter>

    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
    // </BrowserRouter>
  );
}
