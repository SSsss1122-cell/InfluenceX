import Hero from '@/components/Hero';
import WhatIsInfluenceX from '@/components/WhatIsInfluenceX';
import FeaturedProducts from '@/components/FeaturedProducts';
import MapSection from '@/components/map/InfluencerMapSection';
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
      <MapSection />
      <FeaturedProducts />
      <InfluencerGrid />
      <StatsSection />
      <Testimonials />
      <Footer />
    </main>
  );
}