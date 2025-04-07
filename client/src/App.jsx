import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import DeviceDetails from "./pages/DeviceDetails";
import DeviceList from "./pages/DeviceList";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./utlis/ProtectedRoute";
import Layout from "./layouts/Layout";
import { fetchUser } from "./redux/authSlice";
import { useEffect, useState } from "react";
import Loader from "./utlis/Loader";

export default function App() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.auth);
  const [userFetched, setUserFetched] = useState(false);

  useEffect(() => {
    dispatch(fetchUser()).finally(() => setUserFetched(true));
  }, [dispatch]);

  if (!userFetched || loading) return <Loader />;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="devices" element={<DeviceList />} />
            <Route path="device/:id" element={<DeviceDetails />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
