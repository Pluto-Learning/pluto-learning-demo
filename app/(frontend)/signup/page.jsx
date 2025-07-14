"use client";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios"; // Import axios
import { routes } from "@/utils/route";
import { createUser } from "@/app/api/crud";
// import { useRouter } from "next/router";
import { usePathname, useRouter } from "next/navigation";

export default function SignUp() {

  const pathname = usePathname();
  const router = useRouter();
  console.log('pathname: ', pathname)

  const [formData, setFormData] = useState({
    userID: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    college: '',
    userType: '',
    keepSignedIn: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCreateUser = async (e) => {
    try {
      await createUser(formData);
      resetForm();
      router.push('/signin')
    } catch (error) {
      console.error("Error creating User:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCreateUser()
    console.log(formData)
  };

  const resetForm = () => {
    setFormData({
      userID: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      userType: '',
      keepSignedIn: false,
    });
  };

  return (
    <div className="login-form-container">
      <div className="row g-0">
        <div className="col-lg-6 d-none d-lg-block">
          <div className="login-welcome-bg" style={{ backgroundImage: "url('/assets/images/loginform-bg.svg')" }}>
            <div className='nav-bar_logo'>
              <Link href="/">
                <img src={'/assets/images/Pluto-footer-logo-white.png'} alt='logo' className="img-fluid" />
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
                <img src="/assets/images/pluto-profile-logo.png" alt="" className="img-fluid" />
              </div>
              <h3>Sign-Up Now!</h3>
              <p>You are only T-Minus 10 seconds away from an educational experience like no other. Log in on Pluto now and see the difference!</p>
              <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                  <div className="mb-3">
                    <input
                      type="text"
                      className="firstName form-control"
                      name="userID"
                      value={formData.userID}
                      onChange={handleChange}
                      placeholder="User Name"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="firstName form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="lastName form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="college form-control"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="College Name"
                    />
                  </div>
                  {/* <div className="mb-3">
                    <input
                      type="text"
                      className="lastName form-control"
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      placeholder="User Type"
                    />
                  </div> */}
                  <div className="mb-3">
                    <select
                      className="userType form-control"
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                    >
                      <option value="">Select User Type</option>
                      <option value="instructor">Instructor</option>
                      <option value="student">Student</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <input
                      type="email"
                      className="email form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="E-mail"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="password form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div className="text-center forgot-password mb-3">
                  <div className="d-flex justify-content-start align-items-center">
                    {/* <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="keepSignedIn"
                        checked={formData.keepSignedIn}
                        onChange={handleChange}
                        id="flexCheckDefault"
                      />
                      <label className="form-check-label" htmlFor="flexCheckDefault">
                        Keep me signed in
                      </label>
                    </div> */}
                    <p className="mb-0">
                      <a href="/signin">Already a member?</a>
                    </p>
                  </div>
                </div>
                <div className="startExploring">
                  <button type="submit" className="btn submit-btn">
                    Start Exploring
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




