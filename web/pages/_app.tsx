import type { AppProps } from "next/app";

import { AuthProvider } from "@/app/lib/use_auth";
import { NotifyProvider } from "use-notify-rxjs";

import "normalize.css/normalize.css";
import "@/styles/style.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NotifyProvider ttl={3500}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </NotifyProvider>
  );
}
