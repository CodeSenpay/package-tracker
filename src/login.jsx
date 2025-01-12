import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { sendDataToAPI } from "./helpers";
import { useUserContext } from "./usercontext";

import "./css/index.css";

const LoginPage = () => {
  const { setUser } = useUserContext();
  const [useremail, setEmail] = useState("");
  const [userpassword, setPassword] = useState("");

  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const data = {
        email: useremail,
        password: userpassword,
        spname: "login_user",
      };

      const response = await sendDataToAPI(data);
      const result = await response.json();

      console.log(result[0][0]);

      if (result[0][0].statuscode == 1 && result[0][0].level == "origin") {
        setUser(result[0][0]);
        navigate("/dashboard");
      } else if (result[0][0].statuscode == 1 && result[0][0].level == "user") {
        setUser(result[0][0]);
        navigate("/userdashboard");
      } else if (
        result[0][0].statuscode == 1 &&
        result[0][0].level.startsWith("station")
      ) {
        setUser(result[0][0]);
        navigate("/station");
      } else {
        alert("Failed to Log in");
      }
    } catch (error) {
      console.error("Error occurred while fetching data:", error);
    }
  };

  useEffect(() => {
    document.title = "Login";
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <Form.Label htmlFor="inputEmail">Email</Form.Label>
        <Form.Control
          type="email"
          id="inputEmail"
          value={useremail}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Enter Email"
        />
        <br />
        <Form.Label htmlFor="inputPassword">Password</Form.Label>
        <Form.Control
          type="password"
          id="inputPassword"
          placeholder="Enter Password"
          value={userpassword}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <br />
        <br />
        <Button variant="danger" onClick={loginUser}>
          LOGIN
        </Button>

        <p>
          Don&apos;t Have an Account? <Link to="/signup">Sign Up here</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
