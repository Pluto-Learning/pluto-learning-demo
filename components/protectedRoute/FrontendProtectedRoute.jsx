// components/FrontendProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next'; // For retrieving the token from cookies
import { useSelector } from 'react-redux'; // Access Redux state for user and token

const FrontendProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = useSelector((state) => state.auth.token); // Access token from Redux

  useEffect(() => {
    const tokenFromCookie = getCookie('token'); // Retrieve token from cookie if Redux is not persisted

    if (token || tokenFromCookie) {
      setIsAuthenticated(true); // User is authenticated
    } else {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [token, router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>; // Show loading while checking
  }

  return <>{children}</>; // Render protected children
};

export default FrontendProtectedRoute;
