import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Task Control</title>
      </Head>
      <NextIntlClientProvider
        locale={pageProps.locale || "pt"}
        messages={pageProps.messages || {}}
      >
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </NextIntlClientProvider>
    </>
  );
}
