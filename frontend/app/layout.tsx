 
import { AuthProvider } from './usecontext';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import dynamic from "next/dynamic";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "SENKAYIIT",
  description: "application administratif",
};
const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const ClientSideComponent = dynamic(() => import('./citoyen/home/[[...home]]/page'), {
  ssr: false,
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = null; // Replace null with the actual session value
  return (
    <AuthProvider>
    <SessionWrapper session={session}>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </SessionWrapper>
    </AuthProvider>
  );
}
 