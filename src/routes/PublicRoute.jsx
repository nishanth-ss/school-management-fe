import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PublicRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // This effect runs after the component mounts
    const storedToken = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('role')?.trim();

    setToken(storedToken);
    setUserRole(storedRole);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // Show a loading spinner or null while checking auth
    return null; // or <LoadingSpinner />
  }

  const getRedirectPath = (storedRole) => {
    switch (storedRole?.toUpperCase()) {
      case "SUPER ADMIN":
        return "/super-dashboard";
      case "ADMIN":
        return "/dashboard";
      case "POS":
        return "/tuck-shop-pos";
      case "STUDENT":
        return "/student-profile";
      default:
        return "/login";
    }
  };

  if (token) {
    return <Navigate to={getRedirectPath(userRole)} replace />;
  }

  return children;
}