import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader"; // optional if you want a loader here
import { useEffect } from "react";
const ProtectedRoute = () => {
  const { data, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  console.log({ data, loading });

  useEffect(() => {
    if (!loading) {
      if (!data) {
        navigate("/login", { replace: true });
      }
    }
  }, [navigate, data, loading]);

  // Wait for auth to be loaded before making a decision
  if (!data || loading) return <Loader />;

  return data ? <Outlet /> : <Navigate to="/login" replace />;
};
export default ProtectedRoute;
