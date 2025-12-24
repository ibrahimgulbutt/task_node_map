import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientIonicSetup from "@/components/ClientIonicSetup";
import ClientShell from "@/components/ClientShell";

export const metadata: Metadata = {
  title: "Node Mind",
  description: "Productivity app with Tasks, Mind Map, and Focus Timer",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
        suppressHydrationWarning
      >
        <ClientIonicSetup />
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
