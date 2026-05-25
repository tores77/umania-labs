import HeroSequence from "@/components/HeroSequence";
import Portfolio from "@/components/Portfolio";
import RoomProcess from "@/components/RoomProcess";
import StudioEnd from "@/components/StudioEnd";

export default function Home() {
  return (
    <main style={{ margin: 0, padding: 0 }}>
      <HeroSequence />
      <Portfolio />
      <RoomProcess />
      <StudioEnd />
    </main>
  );
}
