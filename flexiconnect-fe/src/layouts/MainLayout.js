import { useContext, useEffect, useState } from "react";
import { MyDispatcherContext } from "../configs/MyContexts";
import cookie from "react-cookies";
import { authApis, endpoints } from "../configs/APIs";
import Header from "./Header";

export default function MainLayout({ children }) {
  const dispatch = useContext(MyDispatcherContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = cookie.load("token");
      if (token) {
        try {
          const res = await authApis().get(endpoints["current-user"]);
          dispatch({ type: "login", payload: res.data });
        } catch (err) {
          console.error("Load user failed:", err);
          dispatch({ type: "logout" });
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [dispatch]);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  if (loading) return <div className="text-center mt-10">Đang tải...</div>;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {children}
      </main>
    </>
  );
}
