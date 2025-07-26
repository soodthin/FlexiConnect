import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../configs/MyContexts";

export default function Dashboard() {
  const user = useContext(MyUserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "CANDIDATE") navigate("/candidate-dashboard");
      else if (user.role === "EMPLOYER") navigate("/employer-dashboard");
    }
    else navigate("/");
  }, [user, navigate]);

  return null; 
}
