import Hero from "@/components/home/Hero";
import WhyInfinite from "@/components/home/WhyInfinite";
import PassportExplainer from "@/components/home/PassportExplainer";
import OurPromise from "@/components/home/OurPromise";
import AboutBoquete from "@/components/home/AboutBoquete";
import Founder from "@/components/home/Founder";
import Contact from "@/components/home/Contact";
import SiteFooter from "@/components/home/SiteFooter";

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center">
        <Hero />
        <WhyInfinite />
        <PassportExplainer />
        <OurPromise />
        <AboutBoquete />
        <Founder />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
