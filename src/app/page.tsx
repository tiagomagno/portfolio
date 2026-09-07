import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Work from '@/components/Work';
import Experience from '@/components/Experience';
import Cases from '@/components/Cases';
import TalkCTA from '@/components/TalkCTA';
import Services from '@/components/Services';
import Consulting from '@/components/Consulting';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Work />
        <Experience />
        <Cases />
        <TalkCTA />
        <Services />
        <Consulting />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
