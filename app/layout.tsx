import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Oh! So Legal",
  description:
    "Legal awareness platform providing clarity on legal issues.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">

        {/* 🔥 GLOBAL NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        {children}

      </body>
    </html>
  );
}