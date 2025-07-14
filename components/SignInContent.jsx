'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { fetchUserProfileById } from '@/app/api/crud';

export default function SignInContent({ setLoading }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const nextAuthData = await signIn('credentials', {
        ...formData,
        redirect: false,
      });

      if (nextAuthData?.error == null) {
        const session = await getSession();

        const userProfileData = await fetchUserProfileById(
          session?.user?.id,
          session?.user?.token
        ).catch((err) => {
          console.error('Error fetching user profile:', err);
          return null;
        });

        router.refresh();

        if (userProfileData) {
          router.push('/table-discovery');
        } else {
          router.push('/profile/edit/setup');
        }

        toast.success('Successfully Logged In');
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      toast.error('An error occurred during sign-in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
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
          <a href="/signup">Don't have an account?</a>
        </p>
      </div>

      <div className="startExploring">
        <button type="submit" className="btn submit-btn w-100">
          Sign in
        </button>
      </div>
    </form>
  );
}
