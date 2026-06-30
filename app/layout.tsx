import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    "TXZ6d0Fld25Oa2pySW13c005anpZaD1x": "5e6ce366e163ff1f5e177e7be7f7a94c",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <GoogleAnalytics gaId="G-J6FN9BFL4W" />
    </>
  );
}
