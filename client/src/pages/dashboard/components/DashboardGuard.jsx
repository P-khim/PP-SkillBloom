"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useCookies } from "react-cookie";

import { GET_USER_INFO } from "../../../utils/constants";
import { useStateProvider } from "../../../context/StateContext";

export default function DashboardGuard({ children }) {
  const router = useRouter();
  const [cookies] = useCookies(["jwt"]);
  const [loading, setLoading] = useState(true);
  const [{ userInfo }, dispatch] = useStateProvider();

  useEffect(() => {
    const checkAccess = async () => {
      if (!cookies.jwt) {
        router.push("/login");
        return;
      }

      try {
        const {
          data: { user },
        } = await axios.post(
          GET_USER_INFO,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
            },
          }
        );

        dispatch?.({ type: "SET_USER_INFO", payload: user });

        if (user.role !== "admin") {
          router.push("/");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };

    checkAccess();
  }, [cookies.jwt, dispatch, router]);

  if (loading) return null; // or loading spinner

  return children;
}
