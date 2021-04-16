import type { AppProps } from "next/app";
import { NotifyProvider } from "use-notify-rxjs";

import { AuthProvider } from "@/app/lib/use_auth";

import "normalize.css/normalize.css";
import "@/styles/style.css";
import { CurrentUserProvider } from "@/app/lib/use_current_user";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NotifyProvider ttl={6500}>
      <AuthProvider>
        <CurrentUserProvider>
          <Component {...pageProps} />
        </CurrentUserProvider>
      </AuthProvider>
    </NotifyProvider>
  );
}
