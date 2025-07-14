'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { fetchUserProfileById } from '@/app/api/crud';
import SocialAuth from '@/components/SocialAuth';


function SignInContent() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSigningIn(true);

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
        ).catch((error) => {
          console.error('Error fetching user profile:', error);
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
      setIsSigningIn(false);
    }
  };

  if (isSigningIn) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Signing in...</span>
        </div>
      </div>
    );
  }

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
                      disabled={isSigningIn}
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
                      disabled={isSigningIn}
                    />
                  </div>
                </div>

                <div className="text-center forgot-password">
                  <p>
                    <Link href="/signup">Don't have an account?</Link>
                  </p>
                </div>

                <div className="startExploring">
                  <button
                    type="submit"
                    className="btn submit-btn"
                    disabled={isSigningIn}
                  >
                    {isSigningIn ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>

              <SocialAuth /> {/* All social auth buttons and logic handled here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);

  if (error) {
    return <div className="text-center text-danger">Error: {error.message}</div>;
  }

  return children;
}

export default function Signin() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '100vh' }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      >
        <SignInContent />
      </Suspense>
    </ErrorBoundary>
  );
}
