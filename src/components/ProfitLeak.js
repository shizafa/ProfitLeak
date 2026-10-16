import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import TestimonialSlider from './TestimonialSlider';
import Pricing from './Pricing';
import Faq from './Faq';
import Footer from './Footer';
import BackToTop from './BackToTop';
import ThemeScripts from './ThemeScripts';

export default function ProfitLeak() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <section className="section">
        <TestimonialSlider />
        <Pricing />
        <Faq />
      </section>

      <Footer />

      <BackToTop />
      <ThemeScripts />
    </>
  );
}
