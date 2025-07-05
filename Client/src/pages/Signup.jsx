import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // form state
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //signing up 
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3434//api/auth/signup", {
        email,
        password,
      });

      //saving the goddamn info
      localStorage.setItem("user", JSON.stringify(res.data));
      //then navigating back to homepage
      navigate("/");
    } catch (error) {
      console.error("signup error:", error);
      setError("Signup Failed");
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center min-w-96 p-3">
        <div className=" p-6  border rounded-lg shadow-md border-black">
          <h1 className="font-semibold text-3xl text-center">
            SIGNUP <span className="text-fuchsia-700">ROADMAP HUB</span>
          </h1>
          <form className="flex flex-col gap-2 mt-4" onSubmit={handleSignup}>
            <div className="flex flex-col">
              <label className="font-medium">
                <span>Email</span>
              </label>
              <input
                type="text"
                value={email}
                placeholder="Enter your Email"
                className="text-black bg-slate-400 h-10 w-full p-2 rounded-sm outline-none"
                onChange={(e)=>{setEmail(e.target.value)}}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium">
                <span>Password</span>
              </label>
              <input
                type="password"
                value={password}
                placeholder="Enter your Password"
                className="text-black bg-slate-400 h-10 w-full p-2 rounded-sm outline-none"
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>

            <Link to="/login" className="font-medium hover:underline">
              Already have an account?
            </Link>

            <div>
              <button className="w-full border border-red-500 bg-red-500 text-white p-2 rounded-sm hover:bg-red-700 transition-all">
                Sign Up
              </button>
            </div>
          </form>
        </div>
        <Link to="/" className="mt-4 hover:underline hover:text-violet-800">
          Back to Home page
        </Link>
      </div>
    </>
  );
};

export default Signup;
