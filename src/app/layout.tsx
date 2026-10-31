import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import DemoBar from '@/components/DemoBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'FoodBridge — Zero Waste Food Donation & Redistribution Platform',
  description:
    'Connecting restaurants, hotels, and caterers with NGOs, shelters, and community kitchens across Hyderabad to eliminate surplus food waste. HACK-P197.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen flex flex-col bg-[#fafaf9] text-gray-900 antialiased">
        <AuthProvider>
          <LanguageProvider>
            <DemoBar />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
