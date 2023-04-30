import Footer from "components/Footer";
import Header from "components/Header";
import { useContext } from "react";
import { Navigate, Outlet, } from "react-router-dom";
import { Context, ContextType } from "util/provider";

export const PrivateLayout = () => {
  const { user } = useContext(Context) as ContextType;

  if (user?._id) {
    return <>
      <Header />
      <Outlet />
      <Footer />
    </>
  }
  return <Navigate to="/login" />
}

export const PublicLayout = () => {
  return <Outlet />
}