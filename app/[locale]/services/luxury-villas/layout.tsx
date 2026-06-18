import { VILLA_HERO_IMAGE } from "@/lib/constants";

export default function LuxuryVillasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href={VILLA_HERO_IMAGE}
        fetchPriority="high"
      />
      {children}
    </>
  );
}
