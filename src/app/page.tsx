import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import ProblemCards from "@/components/ProblemCards";
import HowItWorks from "@/components/HowItWorks";
import FeaturesBento from "@/components/FeaturesBento";
import AIShowcase from "@/components/AIShowcase";
import Testimonials from "@/components/Testimonials";
import ScienceSection from "@/components/ScienceSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <ProblemCards />
        <HowItWorks />
        <FeaturesBento />
        <AIShowcase />
        <Testimonials />
        <ScienceSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
