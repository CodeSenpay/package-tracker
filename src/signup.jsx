import "./css/signup.css";
import { useForm } from "react-hook-form";
import { Form, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { sendDataToAPI } from "./helpers";
function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordShow = () => {
    setShowPassword(!showPassword);
  };
  const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(7).max(20).required(),
    address: yup.string().required(),
    contactnumber: yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const modifiedData = {
      ...data,
      level: "user",
      spname: "register_user",
    };

    console.log(modifiedData);
    const response = await sendDataToAPI(modifiedData);

    reset();
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        style={{
          padding: "40px",
          overflowY: "auto",
          width: "60%",
          height: "90vh",
          borderRadius: "10px",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Label htmlFor="inputFullname">Fullname</Form.Label>
          <Form.Control
            type="text"
            id="inputFullname"
            placeholder="Enter Fullname"
            {...register("name")}
          />
          <p>{errors.fullname?.message}</p>
          <br />
          <Form.Label htmlFor="inputEmail">Email</Form.Label>
          <Form.Control
            type="text"
            id="inputEmail"
            placeholder="Enter Email"
            {...register("email")}
          />
          <p>{errors.email?.message}</p>
          <br />
          <Form.Label htmlFor="inputPassword">Password</Form.Label>
          <div style={{ display: "flex", gap: "10px" }}>
            <Form.Control
              type={showPassword ? "text" : "password"}
              id="inputPassword"
              placeholder="Enter Password"
              {...register("password")}
            />
            <Button
              variant={showPassword ? "success" : "danger"}
              onClick={togglePasswordShow}
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </Button>
          </div>
          <p>{errors.password?.message}</p>
          <br />
          <Form.Label htmlFor="inputAddress">Address</Form.Label>
          <Form.Control
            type="text"
            id="inputAddress"
            placeholder="Enter Address"
            {...register("address")}
          />
          <p>{errors.address?.message}</p>
          <br />
          <Form.Label htmlFor="inputContactNumber">Contact Number</Form.Label>
          <Form.Control
            type="text"
            id="inputContactNumber"
            placeholder="Enter Contact Number"
            {...register("contactnumber")}
          />
          <p>{errors.contactnumber?.message}</p>
          <br />

          <Button variant="danger" type="submit">
            SIGN UP!
          </Button>

          <p>
            Already have Account? <Link to="/">Login</Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default SignUpPage;
