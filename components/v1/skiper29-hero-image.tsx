import Image from "next/image";
import {
  VILLA_HERO_HEIGHT,
  VILLA_HERO_IMAGE,
  VILLA_HERO_WIDTH,
} from "@/lib/constants";

export function Skiper29HeroImage() {
  return (
    <Image
      src={VILLA_HERO_IMAGE}
      alt=""
      width={VILLA_HERO_WIDTH}
      height={VILLA_HERO_HEIGHT}
      priority
      fetchPriority="high"
      sizes="100vw"
      className="h-screen w-full object-cover"
    />
  );
}
