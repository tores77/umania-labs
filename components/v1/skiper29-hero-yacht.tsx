import Image from "next/image";
import ServiceHeroVideo from "@/components/services/ServiceHeroVideo";
import {
  YACHT_HERO_HEIGHT,
  YACHT_HERO_IMAGE,
  YACHT_HERO_VIDEO,
  YACHT_HERO_WIDTH,
} from "@/lib/constants";

export function Skiper29HeroYacht() {
  return (
    <div className="relative h-full w-full">
      <Image
        src={YACHT_HERO_IMAGE}
        alt=""
        width={YACHT_HERO_WIDTH}
        height={YACHT_HERO_HEIGHT}
        priority
        fetchPriority="high"
        sizes="100vw"
        className="h-screen w-full object-cover"
      />
      <ServiceHeroVideo src={YACHT_HERO_VIDEO} poster={YACHT_HERO_IMAGE} />
    </div>
  );
}
