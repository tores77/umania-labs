import Image from "next/image";
import ServiceHeroVideo from "@/components/services/ServiceHeroVideo";
import {
  RESTAURANT_HERO_HEIGHT,
  RESTAURANT_HERO_IMAGE,
  RESTAURANT_HERO_VIDEO,
  RESTAURANT_HERO_WIDTH,
} from "@/lib/constants";

export function Skiper29HeroRestaurant() {
  return (
    <div className="relative h-full w-full">
      <Image
        src={RESTAURANT_HERO_IMAGE}
        alt=""
        width={RESTAURANT_HERO_WIDTH}
        height={RESTAURANT_HERO_HEIGHT}
        priority
        fetchPriority="high"
        sizes="100vw"
        className="h-screen w-full object-cover"
      />
      <ServiceHeroVideo src={RESTAURANT_HERO_VIDEO} poster={RESTAURANT_HERO_IMAGE} />
    </div>
  );
}
