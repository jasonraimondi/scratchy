import type { AppProps } from "next/app";
import { NotifyProvider } from "use-notify-rxjs";

import { AuthProvider } from "@/app/lib/use_auth";

import "normalize.css/normalize.css";
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
