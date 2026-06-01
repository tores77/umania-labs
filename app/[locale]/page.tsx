import HeroSequence from "@/components/HeroSequence";
import PainPoints from "@/components/PainPoints";
import Services from "@/components/Services";
import Packages from "@/components/Packages";
import ProofOfConcept from "@/components/ProofOfConcept";
import Process from "@/components/Process";
import AIAgent from "@/components/AIAgent";
import MarketContext from "@/components/MarketContext";
import CombinedCTA from "@/components/CombinedCTA";
import Footer from "@/components/Footer";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main style={{ margin: 0, padding: 0 }}>
      <HeroSequence />
      <PainPoints />
      <Services />
      <Packages />
      <ProofOfConcept />
      <Process />
      <AIAgent key={locale} />
      <MarketContext />
      <CombinedCTA />
      <Footer />
    </main>
  );
}
