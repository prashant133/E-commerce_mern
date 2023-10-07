import { React, useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import Axios  from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";


const Login = () => {

    // using state for login
   // we have get and set function in useState
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // custom hook
    const [auth, setAuth] = useAuth();

    const navigate = useNavigate(); //we create a variable becuase it is the hook


    // form function
    const handleSubmit = async (e)=> {
        e.preventDefault()
        try {
            const res = await Axios.post(
                `/api/v1/auth/login`,
                {email , password}
            );
            // we are checking it from the server side res.data.success
            if(res && res.data.success){
                toast.success(res.data.message, {duration : 5000});
                // getting the data
                setAuth({
                    ...auth,
                    user : res.data.user,
                    token :  res.data.token
                })
                // storing the data in local storage
                localStorage.setItem('auth',JSON.stringify(res.data))
                navigate("/");
            } else {
                toast.error(res.data.message , {duration : 5000})
            }
            
        } catch (error) {
            console.log(error)
            toast.error("something went wrong", {duration : 5000})
        }

    }

    return (
        <Layout title={"Login"}>
            <div className="form-container">
                <h1>Login page</h1>
                <form onSubmit={handleSubmit}>
                   

                    <div className="mb-3">

                        <input 
                         type="email"
                         value={email}
                         onChange={(e)=>setEmail(e.target.value)}
                         className="form-control" 
                         id="exampleInputEmail"
                         placeholder="Enter your email " 
                         required
                          />

                    </div>
                    <div className="mb-3">

                        <input 
                        type="password" 
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)}
                        className="form-control" 
                        id="exampleInputPassword" 
                        placeholder="Enter your password" 
                        required
                        />
                    </div>
                   


                    <button type="submit" className="btn btn-primary">Login</button>
                </form>


            </div>
        </Layout>
    )
}

export default Login;