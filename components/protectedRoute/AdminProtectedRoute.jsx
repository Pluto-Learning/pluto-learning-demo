// components/AdminProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next'; // For retrieving the token from cookies
import { useSelector } from 'react-redux'; // Access Redux state for user and token

const AdminProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const token = useSelector((state) => state.auth.token); // Access token from Redux
  const user = useSelector((state) => state.auth.user); // Access user from Redux

  useEffect(() => {
    const tokenFromCookie = getCookie('token'); // Retrieve token from cookies if Redux is not persisted

    if (token || tokenFromCookie) {
      const userFromRedux = user || JSON.parse(atob(tokenFromCookie.split('.')[1])); // Decode JWT to get user role
      if (userFromRedux.role === 'admin') {
        setIsAdmin(true); // User is admin
      } else {
        router.push('/signin'); // Redirect non-admins
      }
    } else {
      router.push('/signin'); // Redirect to login if not authenticated
    }
  }, [token, user, router]);

  if (!isAdmin) {
    return <div>Loading...</div>; // Show loading while checking
  }

  return <>{children}</>; // Render protected children for admin
};

export default AdminProtectedRoute;
