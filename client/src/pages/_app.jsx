import "../globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Head from "next/head";
import { useRouter } from "next/router";
import { CookiesProvider, useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { StateProvider } from "../context/StateContext";
import reducer, { initialState } from "../context/StateReducers";
import AuthWrapper from "../components/AuthWrapper";

function AuthGuard({ children }) {
  const router = useRouter();
  const [cookies] = useCookies();

  useEffect(() => {
    if (
      router.pathname.includes("/seller") ||
      router.pathname.includes("/buyer")
    ) {
      if (!cookies.jwt) {
        router.replace("/");
      }
    }
  }, [cookies, router]);

  return children;
}

function InnerApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);
  const [cookies] = useCookies();
  const [{ showLoginModal, showSignupModal }] = require("../context/StateContext").useStateProvider();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <title>SkillBloom</title>
      </Head>
      <div className="relative flex flex-col min-h-screen justify-between">
        <Navbar />
        <main className={`w-full mx-auto ${isClient && typeof window !== 'undefined' && window.location.pathname !== "/" ? "mt-36" : ""} mb-auto`}>
          <AuthGuard>
            <Component {...pageProps} />
          </AuthGuard>
        </main>
        <Footer />

        {/* Conditionally render login/signup modal */}
        {showLoginModal && <AuthWrapper type="login" />}
        {showSignupModal && <AuthWrapper type="signup" />}
      </div>
    </>
  );
}

export default function App(props) {
  return (
    <CookiesProvider>
      <StateProvider initialState={initialState} reducer={reducer}>
        <InnerApp {...props} />
      </StateProvider>
    </CookiesProvider>
  );
}
