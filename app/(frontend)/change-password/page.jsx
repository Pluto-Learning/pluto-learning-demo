"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/app/api/crud";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export default function ChangePassword() {
  const router = useRouter();

  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    userId: '',  // initially empty
    oldPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (session?.user?.id) {
      setFormData(prev => ({ ...prev, userId: session.user.id }));
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await forgotPassword(formData);
      debugger;
      if (response === 1) {
        toast.success(response.message || "Password reset successful.");
        resetForm();
        router.push('/signin');
      } else {
        toast.error(response?.message || "Failed to reset password.");
      }

    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };


  const resetForm = () => {
    setFormData({
      userId: '',  // reset to empty
      oldPassword: '',
      newPassword: '',
    });
  }


  return (
    <div className="login-form-container">
      <div className="row g-0">
        <div className="col-lg-6 d-none d-lg-block">
          <div
            className="login-welcome-bg"
            style={{ backgroundImage: "url('/assets/images/bg-2.jpg')" }}
          >
            <div className="nav-bar_logo">
              <Link href="/">
                <img src="/assets/images/Pluto-footer-logo-white.png" alt="logo" className="img-fluid" />
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
                <img src="/assets/images/Pluto-learning-footer-logo.png" alt="" className="img-fluid" />
              </div>
              <h3>Change Password</h3>
              <div className="secondsText">
                <p>You're just one step away from regaining access. Enter your credentials to change your password.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                  {/* <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      placeholder="Username"
                      required
                    />
                  </div> */}

                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleChange}
                      placeholder="Old Password"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="New Password"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      required
                    />
                  </div>
                </div>


                <div className="startExploring">
                  <button type="submit" className="btn submit-btn">
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
