import Navbar from '@/components/Navbar';   // <- import the component
import './globals.css';

export const metadata = {
  title: 'InfluenceX',
  description: 'Your influencer marketing platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Navbar goes here */}
        <Navbar />

        {/* Add top padding to avoid content being hidden behind fixed navbar */}
        <main className="pt-16 md:pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}