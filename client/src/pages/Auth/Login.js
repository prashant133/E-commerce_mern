import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import Axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the account is blocked
    if (isBlocked) {
      toast.error("Account is blocked. Too many login attempts.");
      return;
    }

    try {
      const res = await Axios.post("/api/v1/auth/login", {
        email,
        password,
      });

      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });

        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);

        // Increment login attempts on failed login
        setLoginAttempts((prevAttempts) => prevAttempts + 1);

        // Check if the user should be blocked
        if (loginAttempts + 1 >= 3) {
          setIsBlocked(true);
        }
      }
    } catch (error) {
      console.log(error);
      
      // check if the credentila is wrong
      if(error.response && error.response.status === 401){
        toast.error("Invalid Credentials or Password Expire");
      }else if(error.response && error.response.status === 403){
       
        setIsBlocked(true);
      }

      else{
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Layout title="Register - Ecommer App">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h4 className="title">LOGIN FORM</h4>

          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="mb-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                navigate("/forgot-password");
              }}
            >
              Forgot Password
            </button>
          </div>

          <button type="submit" className="btn btn-primary">
            LOGIN
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
