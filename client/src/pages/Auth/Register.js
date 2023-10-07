import { React, useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import Axios  from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/AuthStyles.css";


const Register = () => {

    // using state for register
    const [name, setName] = useState("") // we have get and set function in useState
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")

    const navigate = useNavigate(); //we create a variable becuase it is the hook


    // form function
    const handleSubmit = async (e)=> {
        e.preventDefault()
        try {
            const res = await Axios.post(
                `/api/v1/auth/register`,
                {name , email , password , phone , address}
            );
            // we are checking it from the server side res.data.success
            if(res && res.data.success){
                toast.success(res.data.message)
                navigate("/login");
            } else {
                toast.error(res.data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error("something went wrong")
        }

    }

    return (
        <Layout title={"Register"}>
            <div className="form-container">
                <h1>Register page</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">

                        <input
                            type="text"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            className="form-control"
                            id="exampleInputName"
                            placeholder="Enter your name" 
                            required
                            />

                    </div>

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
                    <div className="mb-3">

                        <input 
                        type="text" 
                        value={phone} 
                        onChange={(e)=>setPhone(e.target.value)}
                        className="form-control"
                        id="exampleInputPhone"
                        placeholder="Enter your phone No." 
                        required
                          />

                    </div>
                    <div className="mb-3">

                        <input type="text"
                         value={address} 
                         onChange={(e)=>setAddress(e.target.value)}
                         className="form-control"
                          id="exampleInputAddress" 
                          placeholder="Enter your Address"
                          required
                          />

                    </div>


                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>


            </div>
        </Layout>
    )
}

export default Register;