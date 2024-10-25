import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import { toast } from "react-toastify";

const Form = ({ route, method }: { route: string; method: string }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      let response;
      // If the method is login, send a POST request to the login endpoint
      if (method === "login") {
        //
        response = await api.post(route, {
          email,
          password,
        });
      } else {
        // If the method is register, send a POST request to the register endpoint
        response = await api.post(route, {
          name: username,
          email,
          password,
        });
      }
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, response.data[ACCESS_TOKEN]);
        toast.success("Logged in successfully", {
          position: "top-center",
        });
        navigate("/dashboard");
      } else {
        toast.success("User registered successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      if (method === "login") {
        toast.error("Invalid credentials");
      } else {
        toast.error("Email already registered");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">{name}</h1>
      <div className="space-y-4">
        {method === "register" && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          {name}
        </button>
      </div>
    </form>
  );
};

export default Form;
