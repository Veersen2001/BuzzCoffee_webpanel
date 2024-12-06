import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { setLoading, setUser } = useAuth();

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    setSuccess(""); // Clear any previous success messages

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const payload = { email, password };

    try {
      // Login API call
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed.");
      }

      const result = await response.json();

      if (result.access_token) {
        localStorage.setItem("access_token", result.access_token);

        // Verify token after login
        const verifyResponse = await fetch(`${API_URL}/verify_token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${result.access_token}`,
          },
        });

        // if (!verifyResponse.ok) {
        //   const errorText = await verifyResponse.text();
        //   throw new Error(
        //     `Token verification failed: ${errorText}`
        //   );
        // }

        const verifyResult = await verifyResponse.json();

        // Set the user in context and navigate to dashboard
        setUser(verifyResult);
        setSuccess("Login successful!");
        setTimeout(() => {
          navigate("/restaurant/order/all");
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "An error occurred during login.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-md shadow-md rounded-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-800 font-bold">Login</CardTitle>
        <CardDescription className="text-gray-600">
          Enter your email and password to access the restaurant panel.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        {/* Error or Success Message */}
        {error && (
          <p className="text-sm text-red-600 bg-red-100 px-4 py-2 rounded-md">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-600 bg-green-100 px-4 py-2 rounded-md">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full rounded-md border ${error.includes("Email") ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 ${error.includes("Email")
                  ? "focus:ring-red-500"
                  : "focus:ring-blue-500"
                }`}
              placeholder="Enter your email address"
            />
            {error.includes("Email") && (
              <p className="text-xs text-red-600 mt-1">
                Please enter a valid email address.
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <a
                className="text-sm text-blue-500 hover:underline"
                href="#"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full rounded-md border ${error.includes("Password") ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 ${error.includes("Password")
                    ? "focus:ring-red-500"
                    : "focus:ring-blue-500"
                  }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {error.includes("Password") && (
              <p className="text-xs text-red-600 mt-1">
                Password is required or incorrect.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-2 px-4 bg-black text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
          >
            Log In
          </Button>
        </form>
      </CardContent>

      <CardFooter className="text-center text-sm text-gray-500">
       
      </CardFooter>
    </Card>

  );
}

export default LoginForm;
