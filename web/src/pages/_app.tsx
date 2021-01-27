import { AuthProvider } from "@/app/lib/use_auth";
import { AuthUserProvider } from "@/app/lib/use_auth_user";
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AuthUserProvider>
        <Component {...pageProps} />
      </AuthUserProvider>
    </AuthProvider>
  );
}
