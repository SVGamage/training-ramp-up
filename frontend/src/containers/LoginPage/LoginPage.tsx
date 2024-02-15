/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  FormControl,
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { loginUsers, setAutherization } from "../../redux/slice/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { socket } from "../..";

const LoginPage = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("login_user", (data) => {
      if (data.statusCode === 200) {
        dispatch(setAutherization(data.role as string));
        navigate("/", { state: { role: data.role } });
      }
      if (data.statusCode === 401) {
        setEmailHelperText("");
        setPasswordHelperText("Invalid email or password");
        setEmailError(true);
        setPasswordError(true);
      }
    });
  }, [navigate]);
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError(false);
    setPasswordError(false);

    if (email === "") {
      setEmailError(true);
      setEmailHelperText("Mandotary fields missing");
    }
    if (password === "") {
      setPasswordError(true);
      setPasswordHelperText("Mandotary fields missing");
    }

    if (email && password) {
      dispatch(loginUsers({ email, password }));
      socket.emit("login", email);
    }
  };

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh" }}
        spacing={2}
      >
        <Box
          sx={{ minWidth: isMobile ? "300px" : "400px", paddingLeft: "16px" }}
        >
          <Typography textAlign="start" sx={{ fontSize: "20px" }}>
            Login
          </Typography>
        </Box>
        <Grid item>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <FormControl sx={{ minWidth: isMobile ? "300px" : "400px" }}>
              <TextField
                fullWidth
                size="small"
                label="Email"
                onChange={handleEmailChange}
                variant="outlined"
                type="email"
                value={email}
                error={emailError}
                helperText={emailError ? emailHelperText : null}
                sx={{ marginBottom: "10px" }}
              />
              <TextField
                fullWidth
                size="small"
                label="Password"
                onChange={handlePasswordChange}
                variant="outlined"
                type="password"
                value={password}
                error={passwordError}
                helperText={passwordError ? passwordHelperText : null}
                sx={{ marginBottom: "10px" }}
              />
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ backgroundColor: "rgba(33, 150, 243, 1)" }}
              >
                Login
              </Button>
            </FormControl>
          </form>
        </Grid>
        <Grid item>
          <Stack direction="row" spacing="2px">
            <Typography sx={{ fontSize: "13px" }}>
              Don't have account?
            </Typography>
            <Button
              size="small"
              sx={{
                padding: "0px",
                textTransform: "none",
                color: "rgba(33, 150, 243, 1)",
              }}
              onClick={() => {
                navigate("/register");
              }}
            >
              Register now
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default LoginPage;
