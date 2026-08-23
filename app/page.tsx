import Hero from '@/components/Hero';
import WhatIsInfluenceX from '@/components/WhatIsInfluenceX';
import FeaturedProducts from '@/components/FeaturedProducts';
import MapPreview from '@/components/MapPreview';
import InfluencerGrid from '@/components/InfluencerGrid';
import StatsSection from '@/components/StatsSection';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import Heroo from '@/components/Heroo';


export default function Home() {
  return (
    <main>
      <Hero />
      <Heroo />
      <WhatIsInfluenceX />
      <FeaturedProducts />
      <MapPreview />
      <InfluencerGrid />
      <StatsSection />
      <Testimonials />
      <Footer />
    </main>
  );
}