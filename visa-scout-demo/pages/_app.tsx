import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LanguageProvider } from "@/lib/LanguageContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
