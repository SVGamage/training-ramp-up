import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addUsers } from "../../redux/slice/userSlice";
import { validateEmail } from "../../utility/emailValidator";
// import { io } from "socket.io-client";
// const socket = io("http://localhost:5000");
import { socket } from "../..";
interface IProps {
  openPopup: boolean;
  closePopup: () => void;
}

const AddNewUserForm = ({ openPopup, closePopup }: IProps) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [nameHelperText, setNameHelperText] = useState("");
  const [emailHelperText, setEmailHelperText] = useState("");
  const [role, setRole] = useState("Admin");
  const dispatch = useDispatch();
  useEffect(() => {
    socket.on("send_email", (data) => {
      if (data === 404) {
        setEmailHelperText("The entered email has already been registered");
        setEmailError(true);
      }
    });
  });
  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setName(event.target.value);
  };
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError(false);
    setNameError(false);

    if (name === "") {
      setNameHelperText("Mandotary fields missing");
      setNameError(true);
    }
    if (email === "") {
      setEmailHelperText("Mandotary fields missing");
      setEmailError(true);
    }
    if (email) {
      setEmailError(false);
      if (!validateEmail(email)) {
        setEmailHelperText("Please enter a valid email address");
        setEmailError(true);
      }
    }
    if (email && name) {
      setEmailError(false);
      if (!validateEmail(email)) {
        setEmailHelperText("Please enter a valid email address");
        setEmailError(true);
      } else {
        dispatch(
          addUsers({ name: name, email: email, role: role, password: "12345" })
        );
        socket.emit("sendMail", email);
      }
    }
  };

  return (
    <>
      <Dialog
        open={openPopup}
        sx={{
          "& .MuiDialog-paper": {
            minWidth: isMobile ? "350px" : "400px",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "20px" }}>Add a New User</DialogTitle>
        <DialogContent sx={{ marginLeft: "15px" }}>
          <>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid item sx={{ marginBottom: "15px", marginTop: "20px" }}>
                  <FormControl sx={{ minWidth: isMobile ? "300px" : "400px" }}>
                    <InputLabel size="small" htmlFor="outlined-name">
                      Name
                    </InputLabel>
                    <OutlinedInput
                      size="small"
                      value={name}
                      onChange={handleNameChange}
                      error={nameError}
                      id="outlined-name"
                      type="text"
                      label="Name"
                    />
                    {nameError && (
                      <FormHelperText error>{nameHelperText}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item sx={{ marginBottom: "15px" }}>
                  <FormControl sx={{ minWidth: isMobile ? "300px" : "400px" }}>
                    <InputLabel size="small" htmlFor="outlined-email">
                      Email
                    </InputLabel>
                    <OutlinedInput
                      size="small"
                      value={email}
                      onChange={handleEmailChange}
                      error={emailError}
                      id="outlined-email"
                      type="email"
                      label="Email"
                    />
                    {emailError && (
                      <FormHelperText error>{emailHelperText}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item sx={{ marginBottom: "15px" }}>
                  <FormControl sx={{ minWidth: isMobile ? "300px" : "400px" }}>
                    <InputLabel size="small" htmlFor="role">
                      Role
                    </InputLabel>
                    <Select
                      size="small"
                      autoFocus
                      value={role}
                      onChange={handleRoleChange}
                      label="Role"
                      inputProps={{
                        name: "role",
                        id: "role",
                      }}
                    >
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="Observer">Observer</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <DialogActions sx={{ padding: "0px" }}>
                    <FormControl
                      sx={{ minWidth: isMobile ? "300px" : "400px" }}
                    >
                      <Stack spacing={2} direction="row">
                        <Button
                          variant="contained"
                          size="small"
                          type="submit"
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            backgroundColor: "rgba(33, 150, 243, 1)",
                          }}
                        >
                          Submit
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            closePopup();
                          }}
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "rgba(33, 150, 243, 1)",
                          }}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </FormControl>
                  </DialogActions>
                </Grid>
              </form>
            </Grid>
          </>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddNewUserForm;
