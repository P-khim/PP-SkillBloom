import { useCookies } from "react-cookie";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "../utils/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdFacebook } from "react-icons/md";
import { useRouter } from "next/router";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";

function AuthWrapper({ type }) {
  const [cookies, setCookies] = useCookies();
  const [{ showLoginModal, showSignupModal }, dispatch] = useStateProvider();
  const [error, setError] = useState('');
  const router = useRouter();

  const [values, setValues] = useState({ email: "", password: "" });

  useEffect(() => {
    if (cookies.jwt) {
      dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });
      
      const prevPath = sessionStorage.getItem("prevPath");
      if(prevPath) {
        router.push(prevPath);
        sessionStorage.removeItem("prevPath");
      } else {
        router.push("/");
      }
    }
  }, [cookies, dispatch, router]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClick = async () => {
  try {
    setError("");
    const { email, password } = values;
     if (!email && !password) {
      setError("Please enter both email and password.");
      return;
    }
    if(!email){
      setError("Please enter email");
      return;
    }
    if(!password){
      setError("Please enter password");
      return;
    }
    if (email && password) {
      const {
        data: { jwt },
      } = await axios.post(
        type === "login" ? LOGIN_ROUTE : SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );

      // Save the JWT cookie
      setCookies("jwt", { jwt });

      // ✅ Now fetch user info right after login
      // const { data: userData } = await axios.get("/api/getUserInfo", {
      //   withCredentials: true,
      // });

      if (userData?.user) {
        dispatch({ type: reducerCases.SET_USER, userInfo: userData.user });
        dispatch({ type: reducerCases.CLOSE_AUTH_MODAL });

        const prevPath = sessionStorage.getItem("prevPath");
        if (prevPath) {
          sessionStorage.removeItem("prevPath");
          router.push(prevPath);
        } else {
          router.push("/");
        }
      }
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      setError(err.response.data.message);
    } else if(err.response && err.response.status === 404){
      setError("User not found");
    } else if(err.response && err.response.status === 401){
      setError("Incorrect password");
    } else if (err.response && err.response.status === 409) {
      setError("User already exists.");
    } else {
      setError("Something went wrong. Please try again.");
    }
    console.log(err);
  }
};


  useEffect(() => {
    const html = document.querySelector("html");
    const authModal = document.querySelector("#auth-modal");
    const blurDiv = document.querySelector("#blur-div");
    html.style.overflowY = "hidden";
    const handleBlurDivClick = () => {
      // dispatch(closeAuthModal());
    };
    const handleAuthModalClick = (e) => {
      // e.stopPropagation();
    };
    authModal?.addEventListener("click", handleAuthModalClick);
    blurDiv?.addEventListener("click", handleBlurDivClick);

    return () => {
      const html = document.querySelector("html");
      html.style.overflowY = "initial";
      blurDiv?.removeEventListener("click", handleBlurDivClick);
      authModal?.removeEventListener("click", handleAuthModalClick);
    };
  }, [dispatch, showLoginModal, showSignupModal]);

  return (
    <div className="fixed top-0 z-[100]">
      <div
        className="h-[100vh] w-[100vw] backdrop-blur-md fixed top-0"
        id="blur-div"
      ></div>
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
        <div
          className="fixed z-[101] h-max w-max bg-white flex flex-col justify-center items-center"
          id="auth-modal"
        >
          <div className="flex flex-col justify-center items-center p-8 gap-7">
            <h3 className="text-2xl font-semibold text-slate-700">
              {type === "login" ? "Log" : "Sign"}
              in to SkillBloom
            </h3>
            <div className="flex flex-col gap-5">
              <button className="text-white bg-blue-500 p-3 font-semibold w-80 flex items-center justify-center relative">
                <MdFacebook className="absolute left-4 text-2xl" />
                Continue with Facebook
              </button>
              <button className="border border-slate-300 p-3 font-medium w-80 flex items-center justify-center relative">
                <FcGoogle className="absolute left-4 text-2xl" />
                Continue with Google
              </button>
            </div>
            <div className="relative  w-full text-center">
              <span className="before:content-[''] before:h-[0.5px] before:w-80 before:absolute before:top-[50%] before:left-0 before:bg-slate-400">
                <span className="bg-white relative z-10 px-2">OR</span>
              </span>
            </div>
            <div className="flex flex-col gap-5">
              <input
                type="text"
                name="email"
                placeholder="Email / Username"
                className="border border-slate-300 p-3 w-80"
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-slate-300 p-3 w-80"
                name="password"
                onChange={handleChange}
              />
              <button
                className="bg-[#1DBF73] text-white px-12 text-lg font-semibold rounded-r-md p-3 w-80"
                onClick={handleClick}
                type="button"
              >
                Continue
              </button>
              {error && <p className="text-red-500 text-sm text-center w-80">{error}</p>}
            </div>
          </div>
          <div className="py-5 w-full flex items-center justify-center border-t border-slate-400">
            <span className="text-sm  text-slate-700">
              {" "}
              {type === "login" ? (
                <>
                  Not a member yet?&nbsp;
                  <span
                    className="text-[#1DBF73] cursor-pointer"
                    onClick={() => {
                      dispatch({
                        type: reducerCases.TOGGLE_SIGNUP_MODAL,
                        showSignupModal: true,
                      });
                      dispatch({
                        type: reducerCases.TOGGLE_LOGIN_MODAL,
                        showLoginModal: false,
                      });
                    }}
                  >
                    Join Now
                  </span>
                </>
              ) : (
                <>
                  Already a member?&nbsp;
                  <span
                    className="text-[#1DBF73] cursor-pointer"
                    onClick={() => {
                      dispatch({
                        type: reducerCases.TOGGLE_SIGNUP_MODAL,
                        showSignupModal: false,
                      });
                      dispatch({
                        type: reducerCases.TOGGLE_LOGIN_MODAL,
                        showLoginModal: true,
                      });
                    }}
                  >
                    Login Now
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthWrapper;
