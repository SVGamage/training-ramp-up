import { takeLatest, call, put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  ILoginCredentials,
  IPasswordToken,
  IRegisterUser,
  IUsers,
  addUsers,
  createUsers,
  loginUsers,
  logoutUsers,
  registerUsers,
  setAutherization,
  setAuthorizationError,
  setUserRole,
  verifyUsers,
} from "../slice/userSlice";
import axios from "axios";
axios.defaults.withCredentials = true;
const apiUrl = process.env.REACT_APP_API_USERS as string;
function* watchSendMail(
  action: PayloadAction<IUsers>
): Generator<any, any, any> {
  const newUser = {
    email: action.payload.email,
    name: action.payload.name,
    role: action.payload.role,
    password: action.payload.password,
  };
  try {
    yield call(axios.post<IUsers>, `${apiUrl}/emailSend`, newUser, {
      withCredentials: true,
    });
  } catch (error: any) {
    return error;
  }
}

function* watchCreateUser(
  action: PayloadAction<IPasswordToken>
): Generator<any, any, any> {
  const { password, token } = action.payload;
  try {
    yield call(
      axios.post<IPasswordToken>,
      `${apiUrl}/newUser`,
      {
        password,
        token,
      },
      {
        withCredentials: true,
      }
    );
  } catch (error: any) {
    return error;
  }
}

function* watchLoginUser(
  action: PayloadAction<ILoginCredentials>
): Generator<any, any, any> {
  const { email, password } = action.payload;
  try {
    yield put(setAuthorizationError(false));
    yield put(setAutherization(false));
    yield call(
      axios.post<ILoginCredentials>,
      `${apiUrl}/loginUser`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
  } catch (error: any) {
    return error;
  }
}

function* watchLogoutUser(): Generator<any, any, any> {
  try {
    yield call(axios.post, `${apiUrl}/logoutUser`, {
      withCredentials: true,
    });
  } catch (error: any) {
    return error;
  }
}
function* watchRegisterUser(
  action: PayloadAction<IRegisterUser>
): Generator<any, any, any> {
  const { name, email, password } = action.payload;
  try {
    yield call(
      axios.post<IRegisterUser>,
      `${apiUrl}/registerUser`,
      {
        name,
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
  } catch (error: any) {
    return error;
  }
}
function* watchVerifyUser(): Generator<any, any, any> {
  try {
    yield put(setAuthorizationError(false));
    yield put(setAutherization(false));
    const res = yield call(axios.post, `${apiUrl}/verifyAuth`, {
      withCredentials: true,
    });
    const data = yield res.data;
    if (res.status === 200) {
      yield put(setAutherization(true));
      yield put(setAuthorizationError(false));
      yield put(setUserRole(data.role as string));
    }
    if (res.status === 401) {
      yield put(setAutherization(false));
      yield put(setAuthorizationError(true));
    }
  } catch (error) {
    yield put(setAutherization(false));
    yield put(setAuthorizationError(true));
    return error;
  }
}
export function* userRoleSaga() {
  yield takeLatest(addUsers, watchSendMail);
  yield takeLatest(createUsers, watchCreateUser);
  yield takeEvery(loginUsers, watchLoginUser);
  yield takeLatest(logoutUsers, watchLogoutUser);
  yield takeLatest(registerUsers, watchRegisterUser);
  yield takeEvery(verifyUsers, watchVerifyUser);
}
