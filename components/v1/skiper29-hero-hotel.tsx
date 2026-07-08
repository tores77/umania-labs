import Image from "next/image";
import ServiceHeroVideo from "@/components/services/ServiceHeroVideo";
import {
  HOTEL_HERO_HEIGHT,
  HOTEL_HERO_IMAGE,
  HOTEL_HERO_VIDEO,
  HOTEL_HERO_WIDTH,
} from "@/lib/constants";

export function Skiper29HeroHotel() {
  return (
    <div className="relative h-full w-full">
      <Image
        src={HOTEL_HERO_IMAGE}
        alt=""
        width={HOTEL_HERO_WIDTH}
        height={HOTEL_HERO_HEIGHT}
        priority
        fetchPriority="high"
        sizes="100vw"
        className="h-screen w-full object-cover"
      />
      <ServiceHeroVideo src={HOTEL_HERO_VIDEO} poster={HOTEL_HERO_IMAGE} />
    </div>
  );
}
