import "./globals.css";

export const metadata = {
  title: "Oh! So Legal",
  description:
    "A legal awareness platform providing structured clarity on legal issues in Hyderabad. Get your queries reviewed by experienced advocates.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}