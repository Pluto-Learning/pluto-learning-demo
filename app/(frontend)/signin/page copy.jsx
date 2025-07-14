"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { fetchUserProfileById } from "@/app/api/crud"; // ✅ Update path if needed

export default function Signin() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false); // ✅ new state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextAuthData = await signIn("credentials", {
      ...formData,
      redirect: false,
    });

    if (nextAuthData?.error == null) {
      const session = await getSession();
      const userProfileData = await fetchUserProfileById(
        session?.user?.id,
        session?.user?.token
      );

      router.refresh();

      if (userProfileData) {
        router.push("/table-discovery");
      } else {
        router.push("/profile/edit/setup");
      }

      toast.success("Successfully Logged In");
    } else {
      toast.error("Invalid username or password");
    }
  };

  const loginNowGoogle = async () => {
    const token = searchParams.get("token");
    if (!token) return;

    setIsGoogleSigningIn(true); // ✅ Show loader

    const nextAuthData = await signIn("credentials", {
      provider: "google",
      token: token,
      username: searchParams.get("username") ?? "pluto_google_user",
      email: searchParams.get("email") ?? "pluto_google_user@gmail.com",
      password: searchParams.get("password") ?? "pluto_google_user_password",
      redirect: false,
    });

    if (nextAuthData?.error == null) {
      const session = await getSession();
      const userProfileData = await fetchUserProfileById(
        session?.user?.id,
        session?.user?.token
      );

      router.refresh();

      if (userProfileData) {
        router.push("/table-discovery");
      } else {
        router.push("/profile/edit/setup");
      }

      toast.success("Successfully Logged In");
    } else {
      toast.error("Google Login Failed");
    }

    setIsGoogleSigningIn(false); // fallback
  };

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      loginNowGoogle();
    }
  }, [searchParams]);

  // ✅ Show loader while Google auth in progress
  if (isGoogleSigningIn) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Signing in with Google...</span>
        </div>
      </div>
    );
  }

  // ✅ Default Signin page
  return (
    <div className="login-form-container">
      <div className="row g-0">
        <div className="col-lg-6 d-none d-lg-block">
          <div
            className="login-welcome-bg"
            style={{
              backgroundImage: "url('/assets/images/loginform-bg.svg')",
            }}
          >
            <div className="nav-bar_logo">
              <Link href="/">
                <img
                  src="/assets/images/Pluto-footer-logo-white.png"
                  alt="logo"
                  className="img-fluid"
                />
              </Link>
            </div>
            <p className="NiceToSeeYou">NICE TO SEE YOU AGAIN</p>
            <h1 className="WelcomeBack">WELCOME BACK</h1>
            <p className="connectGrowexplore">connect. grow. explore</p>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="form-bg">
            <div className="form-bg-content">
              <div className="logo mb-3 d-lg-none">
                <img
                  src="/assets/images/Pluto-learning-footer-logo.png"
                  alt=""
                  className="img-fluid"
                />
              </div>

              <h3>Sign-In Now</h3>
              <div className="secondsText">
                <p>
                  You are only T-Minus 10 seconds away from an educational
                  experience like no other. Log in on Pluto now and see the
                  difference!
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                    />
                  </div>
                </div>

                <div className="text-center forgot-password">
                  <p>
                    <Link href="/signup">Don't have an account?</Link>
                  </p>
                </div>

                <div className="startExploring">
                  <button type="submit" className="btn submit-btn">
                    Sign in
                  </button>
                </div>
              </form>

              {/* Google Sign-In link */}
              <a
                className="btn google-login-btn mt-3"
                href="https://backend-pluto-learning-dke2gng3f4gzapbr.centralus-01.azurewebsites.net/api/Login/GoogleLogin/google-login"
              >
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                <span>
                  Continue with Google
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
