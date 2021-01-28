import type { AppProps } from 'next/app'

import { AuthProvider } from "@/app/lib/use_auth";
import { AuthUserProvider } from "@/app/lib/use_auth_user";

import "tailwindcss/tailwind.css";
import '@/styles/globals.css'
import '@/styles/style.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AuthUserProvider>
        <Component {...pageProps} />
      </AuthUserProvider>
    </AuthProvider>
  );
}
