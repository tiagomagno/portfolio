import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Manifesto from '@/components/Manifesto';
import Services from '@/components/Services';
import Work from '@/components/Work';
import Cases from '@/components/Cases';
import Insights from '@/components/Insights';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Manifesto />
        <Services />
        <Work />
        <Cases />
        <Insights />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
