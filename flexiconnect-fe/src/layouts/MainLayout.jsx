import { useContext, useEffect, useState } from 'react';
import { MyDispatcherContext } from '@contexts/MyContexts';
import cookie from 'react-cookies';
import { authApis, endpoints } from '@configs/APIs';
import Header from '@layouts/Header';
import Footer from '@layouts/Footer';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-beige-100 dark:bg-dark-bg-primary">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 spinner"></div>
          <p className="text-neutral-600 dark:text-dark-text-secondary">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-dark-bg-primary text-softblack dark:text-dark-text-primary transition-colors duration-200">
        {children}
      </main>
      <Footer />
    </>
  );
}
