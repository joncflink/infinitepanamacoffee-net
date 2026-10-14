import Hero from "@/components/home/Hero";
import Founder from "@/components/home/Founder";
import WhyInfinite from "@/components/home/WhyInfinite";
import OurPromise from "@/components/home/OurPromise";
import AboutBoquete from "@/components/home/AboutBoquete";
import PassportExplainer from "@/components/home/PassportExplainer";
import FindPassport from "@/components/home/FindPassport";
import WaitlistCta from "@/components/home/WaitlistCta";
import Faq from "@/components/home/Faq";
import Contact from "@/components/home/Contact";

// Flow: story -> origin -> the coffee -> waitlist CTA -> FAQ -> contact.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center">
      <Hero />
      <Founder />
      <WhyInfinite />
      <OurPromise />
      <AboutBoquete />
      <PassportExplainer />
      <FindPassport />
      <WaitlistCta />
      <Faq />
      <Contact />
    </main>
  );
}
