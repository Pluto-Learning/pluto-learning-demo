'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { fetchUserProfileById } from '@/app/api/crud';

const SOCIAL_PROVIDERS = {
  google: {
    name: 'Google',
    url:
      process.env.NEXT_PUBLIC_GOOGLE_LOGIN_URL ||
      'https://backend-pluto-learning-dke2gng3f4gzapbr.centralus-01.azurewebsites.net/api/Login/GoogleLogin/google-login',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
      </svg>
    ),
  },
  // Add more providers like github, facebook, etc.
};

export default function SocialAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const loginWithSocial = async (provider) => {
    const token = searchParams.get('token');
    if (!token) return;

    try {
      const nextAuthData = await signIn('credentials', {
        provider,
        token,
        username: searchParams.get('username') ?? `pluto_${provider}_user`,
        email: searchParams.get('email') ?? `pluto_${provider}_user@gmail.com`,
        password: searchParams.get('password') ?? `pluto_${provider}_user_password`,
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
          router.push('/table-discovery');
        } else {
          router.push('/profile/edit/setup');
        }

        toast.success('Successfully Logged In');
      } else {
        toast.error(`${provider} Login Failed`);
      }
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      toast.error(`An error occurred during ${provider} sign-in`);
    }
  };

  // Auto-trigger sign-in from provider callback
  useEffect(() => {
    const token = searchParams.get('token');
    const provider = searchParams.get('provider') ?? 'google';

    if (token && provider in SOCIAL_PROVIDERS) {
      loginWithSocial(provider);
    }
  }, [searchParams]);

  return (
    <div className="social-auth-buttons mt-3">
      {Object.entries(SOCIAL_PROVIDERS).map(([provider, { name, url, icon }]) => (
        <a
          key={provider}
          className="btn google-login-btn d-flex align-items-center justify-content-center mb-2"
          href={url}
        >
          {icon}
          <span className="ms-2"><span className='d-none d-sm-inline'>Continue with</span> {name}</span>
        </a>
      ))}
    </div>
  );
}
