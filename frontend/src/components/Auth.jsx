// components/Auth.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { HeaderS } from "./header";

export const Auth = ({ type }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendRequest = async () => {
    setError("");

    // Client-side validation
    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type}`, {
        username,
        password,
      });

      const jwt = response.data.token;
      if (!jwt) {
        setError("Backend did not return a token");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", "Bearer " + jwt);
      setLoading(false);

      navigate("/blogs"); // Redirect to journaling page
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.message ||
        "Something went wrong. Please try again.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-slate-100 to-slate-300">
      <div className="w-full max-w-md p-8 bg-white border rounded-2xl shadow-lg">
        <HeaderS type={type} />

        <h2 className="text-2xl font-bold text-center text-gray-800 mt-2">
          {type === "signup" ? "Create Your Journal Account" : "Welcome Back to Your Journal"}
        </h2>
        <p className="text-gray-500 text-sm text-center mb-4">
          {type === "signup" ? "Start writing your thoughts today." : "Continue your journaling journey."}
        </p>

        <LabelledInput
          label="Username"
          placeholder="e.g. DailyThinker"
          onChange={(e) => setUsername(e.target.value)}
        />
        <LabelledInput
          label="Password"
          type="password"
          placeholder="Your secure password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="text-red-600 bg-red-100 border border-red-300 rounded p-2 mt-3">
            {error}
          </div>
        )}

        <button
          onClick={sendRequest}
          type="button"
          disabled={loading}
          className={`mt-6 w-full text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-5 py-2.5 shadow-md transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading
            ? type === "signup"
              ? "Creating Account..."
              : "Signing In..."
            : type === "signup"
            ? "Start Journaling"
            : "Enter Journal"}
        </button>
      </div>
    </div>
  );
};

function LabelledInput({ label, placeholder, onChange, type = "text" }) {
  return (
    <div className="mt-3">
      <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
      <input
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
      />
    </div>
  );
}
