import { GoogleAnalytics } from "@next/third-parties/google";

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
