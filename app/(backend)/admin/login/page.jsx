// app/backend/admin-login/page.jsx
"use client";

import { useState } from 'react';
// import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
// import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
// import { login } from '@/store/slices/authSlice';
import { signIn } from "next-auth/react"

export default function AdminLogin() {
  // const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let nextAuthData = await signIn("credentials", {
      ...formData,
      redirect: false
    })
    console.log(nextAuthData)
    if (nextAuthData?.ok == true) {
      router.push('/admin/dashboard')
    }
    // try {
    //   const response = await axiosInstance.post('/admin-login', formData);
    //   const { userName, token } = response.data;

    //   // Dispatch login action
    //   dispatch(login({ user: userName, token }));

    //   // Redirect to the admin dashboard or another page
    //   toast.success("Login successful!");
    //   router.push('/backend/admin-dashboard'); // Change this to your actual path
    // } catch (error) {
    //   toast.error("Login failed. Please try again.");
    // }
  };

  return (
    <div className="container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}
