import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IUsers {
  email: string;
  name: string;
  role: string;
  password: string;
}
export interface IPasswordToken {
  password: string;
  token: string;
}
export interface ILoginCredentials {
  email: string;
  password: string;
}
export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
}
interface IinitialState {
  isAuthorized: boolean;
  authorizationError: boolean;
  userRole: string;
}

const initialState: IinitialState = {
  isAuthorized: false,
  authorizationError: false,
  userRole: "",
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUsers: (state, action: PayloadAction<IUsers>) => {},
    createUsers: (state, action: PayloadAction<IPasswordToken>) => {},
    loginUsers: (state, action: PayloadAction<ILoginCredentials>) => {},
    logoutUsers: (state) => {},
    registerUsers: (state, action: PayloadAction<IRegisterUser>) => {},
    verifyUsers: (state) => {},
    setAutherization: (state, action: PayloadAction<string>) => {
      state.isAuthorized = true;
      state.authorizationError = false;
      state.userRole = action.payload;
    },
    setUnautherization: (state) => {
      state.isAuthorized = false;
      state.authorizationError = true;
    },
  },
});

export const {
  addUsers,
  createUsers,
  loginUsers,
  logoutUsers,
  registerUsers,
  verifyUsers,
  setAutherization,
  setUnautherization,
} = userSlice.actions;

export default userSlice.reducer;
