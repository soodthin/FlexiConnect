  import { useContext, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
import { MyUserContext } from '@contexts/MyContexts';
import JobPostList from '@public/JobPostList';

  export default function Dashboard() {
    const user = useContext(MyUserContext);
    const navigate = useNavigate();

    useEffect(() => {
      if (user) {
        if( user.role === "ADMIN") navigate("/admin-dashboard");
        else if (user.role === "CANDIDATE") navigate("/candidate-dashboard");
        else if (user.role === "EMPLOYER") navigate("/employer-dashboard");
      }
      else navigate("/");
    }, [user, navigate]);

    return (<JobPostList />);
  }
  
