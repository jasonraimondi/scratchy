import type { AppProps } from "next/app";

import { AuthProvider } from "@/app/lib/use_auth";
import { NotifyProvider } from "use-notify-rxjs";

import "tailwindcss/tailwind.css";
import "@/styles/globals.css";
import "@/styles/style.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NotifyProvider ttl={6500}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </NotifyProvider>
  );
}
