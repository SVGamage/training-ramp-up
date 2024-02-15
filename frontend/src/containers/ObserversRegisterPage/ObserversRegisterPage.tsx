import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../..";
import { useDispatch } from "react-redux";
import { registerUsers } from "../../redux/slice/userSlice";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import { validateEmail } from "../../utility/emailValidator";
import validator from "validator";
const ObserversRegisterPage = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameHelperText, setNameHelperText] = useState("");
  const [emailHelperText, setEmailHelperText] = useState("");
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] =
    useState("");
  const [succesMesasage, setSuccessMessage] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    socket.on("register_user", (data) => {
      if (data === 200) {
        setSuccessMessage(true);
      }
      if (data === 400) {
        setEmailHelperText("The entered email has already been registered");
        setEmailError(true);
      }
    });
  }, [navigate]);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleMouseDownConfirmPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setPasswordError(false);
    setPassword(event.target.value);
    if (
      validator.isStrongPassword(event.target.value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }) === false
    ) {
      setPasswordError(true);
      setPasswordHelperText("Weak Password");
    }
  };
  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setConfirmPasswordError(false);
    setConfirmPassword(event.target.value);
  };
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setNameError(false);
    setName(event.target.value);
  };
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setEmailError(false);
    setEmail(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      setEmailHelperText("Please enter a valid email address");
      setEmailError(true);
    }
    if (name === "") {
      setNameHelperText("Mandotary fields missing");
      setNameError(true);
    }
    if (email === "") {
      setEmailHelperText("Mandotary fields missing");
      setEmailError(true);
    }
    if (password === "") {
      setPasswordHelperText("Mandotary fields missing");
      setPasswordError(true);
    }
    if (confirmPassword === "") {
      setConfirmPasswordHelperText("Mandotary fields missing");
      setConfirmPasswordError(true);
    }

    if (confirmPassword && password) {
      if (confirmPassword !== password) {
        setConfirmPasswordHelperText("Please make sure your passwords match!");
        setConfirmPasswordError(true);
      } else {
        if (passwordError === false) {
          dispatch(registerUsers({ name, email, password }));
          socket.emit("register", email);
        }
      }
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
          sx={{ minWidth: isMobile ? "300px" : "400px", marginBottom: "20px" }}
        >
          <Typography textAlign="start" sx={{ fontSize: "20px" }}>
            Register
          </Typography>
        </Box>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid item>
            <TextField
              fullWidth
              size="small"
              label="Name"
              onChange={handleNameChange}
              variant="outlined"
              type="text"
              value={name}
              error={nameError}
              helperText={nameError ? nameHelperText : null}
              sx={{ marginBottom: "10px" }}
            />
          </Grid>
          <Grid item>
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
          </Grid>
          <Grid item sx={{ marginBottom: "10px" }}>
            <FormControl sx={{ minWidth: isMobile ? "300px" : "400px" }}>
              <InputLabel
                size="small"
                htmlFor="outlined-password"
                color={passwordError ? "error" : "primary"}
              >
                Password
              </InputLabel>
              <OutlinedInput
                size="small"
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
                id="outlined-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              {passwordError && (
                <FormHelperText error>{passwordHelperText}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item sx={{ marginBottom: "10px" }}>
            <FormControl sx={{ minWidth: isMobile ? "300px" : "400px" }}>
              <InputLabel
                size="small"
                htmlFor="outlined-cpassword"
                color={confirmPasswordError ? "error" : "primary"}
              >
                Confirm Password
              </InputLabel>
              <OutlinedInput
                size="small"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={confirmPasswordError}
                id="outlined-cpassword"
                type={showConfirmPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
              />
              {confirmPasswordError && (
                <FormHelperText error>
                  {confirmPasswordHelperText}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl sx={{ minWidth: isMobile ? "300px" : "400px" }}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ backgroundColor: "rgba(33, 150, 243, 1)" }}
              >
                Submit
              </Button>
            </FormControl>
          </Grid>
        </form>
        <Grid item>
          <Stack direction="row">
            <Typography sx={{ fontSize: "13px" }}>
              Already have an account?
            </Typography>
            <Button
              size="small"
              sx={{
                padding: "0px",
                textTransform: "none",
                color: "rgba(33, 150, 243, 1)",
              }}
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </Button>
          </Stack>
        </Grid>
      </Grid>
      {succesMesasage && (
        <PopupMessage
          open={succesMesasage}
          title={"Your account has been successfully created."}
          handleClickSecondButton={() => navigate("/login")}
          secondButtonName="Ok"
        />
      )}
    </>
  );
};

export default ObserversRegisterPage;
