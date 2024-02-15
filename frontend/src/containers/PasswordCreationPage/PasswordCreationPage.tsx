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
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import validator from "validator";
import { createUsers } from "../../redux/slice/userSlice";
import PopupMessage from "../../components/PopupMessage/PopupMessage";

import { socket } from "../..";
const PasswordCreationPage = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [confirmPasswordHelperText, setConfirmPasswordHelperText] =
    useState("");
  const [succesMesasage, setSuccessMessage] = useState(false);
  const query = new URLSearchParams(useLocation().search);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("create_new_user", (data) => {
      if (data === 200) {
        setSuccessMessage(true);
      }
    });
  }, []);

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
    setPasswordHelperText("");
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
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmPasswordError(false);
    setPasswordError(false);

    if (password === "") {
      setPasswordError(true);
      setPasswordHelperText("Mandotary fields missing");
    }
    if (confirmPassword === "") {
      setConfirmPasswordError(true);
      setConfirmPasswordHelperText("Mandotary fields missing");
    }

    if (confirmPassword && password) {
      if (confirmPassword !== password) {
        setPasswordHelperText("");
        setConfirmPasswordHelperText("Please make sure your passwords match!");
        setConfirmPasswordError(true);
      } else {
        dispatch(
          createUsers({
            password: password,
            token: query.get("token") as string,
          })
        );
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
            Create your password
          </Typography>
        </Box>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid item sx={{ marginBottom: "10px" }}>
            <FormControl sx={{ minWidth: isMobile ? "300px" : "400px" }}>
              <InputLabel
                size="small"
                htmlFor="outlined-password"
                color={confirmPasswordError ? "error" : "primary"}
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
                htmlFor="outlined-confirm-password"
                color={confirmPasswordError ? "error" : "primary"}
              >
                Confirm Password
              </InputLabel>
              <OutlinedInput
                size="small"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={confirmPasswordError}
                id="outlined-confirm-password"
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
      </Grid>
      {succesMesasage && (
        <PopupMessage
          open={succesMesasage}
          title={"Your account has been successfully created."}
          handleClickSecondButton={() => {
            setSuccessMessage(false);
            navigate("/login");
          }}
          secondButtonName="Ok"
        />
      )}
    </>
  );
};

export default PasswordCreationPage;
