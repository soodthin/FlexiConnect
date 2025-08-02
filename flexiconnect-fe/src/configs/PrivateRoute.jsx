import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { MyUserContext } from '@contexts/MyContexts';

export default function PrivateRoute({ allowedRoles, children }) {
  const user = useContext(MyUserContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
