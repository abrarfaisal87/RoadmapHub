import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";



const Login = () => {
 
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  //handle login
  const handleLogin = async (e)=>{
       e.preventDefault();
       try {
        const res = await axios.post("http://localhost:3434//api/auth/login",{
          email,
          password
        })
        
        //saving the token info in browser localstorage
        localStorage.setItem("user",JSON.stringify(res.data));
        //redirecting to my home page
        navigate('/');

       } catch (error) {
        console.error("login error:",error)
        setError("Invalid email or password");
       }
  }


  return (
    <div className="h-screen flex flex-col items-center justify-center min-w-96 p-3">
      <div className=" p-6  border rounded-lg shadow-md border-black">
        <h1 className="font-bold text-3xl text-center">
          LOGIN <span className="text-fuchsia-700">ROADMAP HUB</span>
        </h1>
        <form className="flex flex-col gap-2 mt-4" onSubmit={handleLogin}>
          <div className="flex flex-col">
            <label className="font-medium">
              <span>Email</span>
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="text-black bg-slate-400 h-10 w-full p-2 rounded-sm outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">
              <span>Password</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="text-black bg-slate-400 h-10 w-full p-2 rounded-sm outline-none"
            />
          </div>
          <Link to="/signup" className="font-medium hover:underline">
            Dont have an account?
          </Link>
          <div>
            <button className="w-full border border-red-500 bg-red-500 text-white p-2 rounded-sm hover:bg-red-700 transition-all">
              Login
            </button>
          </div>
        </form>
      </div>
      <Link to="/" className="mt-4 hover:underline hover:text-violet-800">
        Back to Home page
      </Link>
    </div>
  );
};

export default Login;
