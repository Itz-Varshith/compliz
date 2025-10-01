import { Geist, Geist_Mono } from "next/font/google";
import {AppToaster} from "@/components/ui/toaster.jsx"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Compliz",
  description: "Your all in one Coding platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <AppToaster/>
      </body>
    </html>
  );
}
