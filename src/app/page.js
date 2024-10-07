"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { authenticate } from "./actions";
import { useEffect, useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = Cookie.get("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const login = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    // Check if email or password is empty
    if (!email || !password) {
      alert("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);
      const loginRes = await authenticate(email, password); // once cors issue is resolved

      // Check if the response contains the token
      if (loginRes && loginRes.Token) {
        const token = loginRes.Token;
        const user = loginRes.User;

        const decodedToken = jwtDecode(token);
        const expirationDate = new Date(decodedToken.exp * 1000 + 2 * 3600000);

        // Store the token in cookies with expiration date
        Cookie.set("token", token, { expires: expirationDate });
        localStorage.setItem("userAuth", JSON.stringify(loginRes));
        localStorage.setItem("user", user);
        localStorage.setItem("token", token);

        setLoading(false);

        // Go to next screen
        router.push("/dashboard");
      } else {
        alert("Login failed, please try again!");
      }
    } catch (err) {
      console.error("Login error: ", err);
      alert("Login failed, please check your credentials and try again.");
    }
  };

  return (
    <main className={!loading ? styles.main : styles.mainLoading}>
      <div className={styles.description}></div>

      <div className={styles.center}>
        <p>{loading ? "Logging In..." : "Streaming Manager"}</p>
      </div>

      <div style={{width: '70%'}}>
        <form className={styles.flex_col} onSubmit={login}>
          <input type="email" name="email" placeholder="Email" />
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: 3, top: 3 }}
            >
              {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </span>
          </div>
          <button
            disabled={loading}
            style={{ cursor: loading ? "not-allowed" : "default" }}
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
