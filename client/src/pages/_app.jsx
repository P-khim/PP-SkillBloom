import "../globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import Head from "next/head";
import { useRouter } from "next/router";
import { CookiesProvider } from "react-cookie";
import { useEffect } from "react";
import { StateProvider } from "../context/StateContext";
import reducer, { initialState } from "../context/StateReducers";
import { useCookies } from "react-cookie";

function AuthGuard({ children }) {
  const router = useRouter();
  const [cookies] = useCookies();

  useEffect(() => {
    if (
      router.pathname.includes("/seller") ||
      router.pathname.includes("/buyer")
    ) {
      if (!cookies.jwt) {
        router.push("/");
      }
    }
  }, [cookies, router]);

  return children;
}

export default function App({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <StateProvider initialState={initialState} reducer={reducer}>
        {/* <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <title>SkillBloom</title>
        </Head> */}
        <div className="relative flex flex-col h-screen justify-between">
          {/* <Navbar /> */}
          <div
            className={`${
              typeof window !== "undefined" && window.location.pathname !== "/"
                ? "mt-36"
                : ""
            } mb-auto w-full mx-auto`}
          >
            <AuthGuard>
              <Component {...pageProps} />
            </AuthGuard>
          </div>
          {/* <Footer /> */}
        </div>
      </StateProvider>
    </CookiesProvider>
  );
}
