import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Oh! So Legal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">

        <Navbar />

        {children}

      </body>
    </html>
  );
}