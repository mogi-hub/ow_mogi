import "./globals.css";
import { config } from "@/lib/config";

export const metadata = { title: config.siteTitle, description: config.headline };
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: config.theme.bg };

export default function RootLayout({ children }) {
  const vars = Object.fromEntries(Object.entries(config.theme).map(([k, v]) => [`--${k}`, v]));
  return (
    <html lang="ko" style={vars}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Noto+Sans+KR:wght@400;700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
