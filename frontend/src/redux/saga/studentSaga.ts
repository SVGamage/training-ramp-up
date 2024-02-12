import {
  takeLatest,
  put,
  call,
  takeLeading,
  takeEvery,
} from "redux-saga/effects";
import { GridRowId, GridValidRowModel } from "@mui/x-data-grid";
import axios from "axios";
import {
  addStudent,
  addStudentError,
  editStudent,
  fetchAllStudents,
  fetchStudentsError,
  removeStudent,
  removeStudentError,
  updateStudent,
  updateStudentError,
} from "../slice/studentSlice";
import { PayloadAction } from "@reduxjs/toolkit";
axios.defaults.withCredentials = true;
const apiUrl = process.env.REACT_APP_BACKEND as string;

function* watchGetAllStudents(): Generator<any, any, any> {
  try {
    const { data } = yield call(
      axios.get<GridValidRowModel[]>,
      `${apiUrl}/students/getAllStudents`,
      {
        withCredentials: true,
      }
    );
    yield put(updateStudent(data));
  } catch (error: any) {
    yield put(fetchStudentsError(error));

    console.log(error);
  }
}

function* watchAddNewStudent(
  action: PayloadAction<GridValidRowModel>
): Generator<any, any, any> {
  const newStudent = {
    id: action.payload.id,
    name: action.payload.name,
    gender: action.payload.gender,
    address: action.payload.address,
    mobileno: action.payload.mobileno,
    dateofbirth: action.payload.dateofbirth,
    age: action.payload.age,
  };
  try {
    yield call(
      axios.post<GridValidRowModel>,
      `${apiUrl}/students/newStudent`,
      newStudent,
      {
        withCredentials: true,
      }
    );
  } catch (error: any) {
    yield put(addStudentError());
    return error;
  }
}

function* watchUpdateStudent(action: PayloadAction<GridValidRowModel>) {
  const updatedStudent = {
    name: action.payload.name,
    gender: action.payload.gender,
    address: action.payload.address,
    mobileno: action.payload.mobileno,
    dateofbirth: action.payload.dateofbirth,
    age: action.payload.age,
  };
  try {
    yield call(
      axios.put<GridValidRowModel>,
      `${apiUrl}/students/updateStudent/${action.payload.id}`,
      updatedStudent,
      {
        withCredentials: true,
      }
    );
  } catch (error: any) {
    yield put(updateStudentError(error));
    return error;
  }
}

function* watchRemoveStudent(action: PayloadAction<GridRowId>) {
  try {
    yield call(
      axios.delete,
      `${apiUrl}/students/removeStudent/${action.payload}`,
      {
        withCredentials: true,
      }
    );
  } catch (error: any) {
    yield put(removeStudentError(error));
    return error;
  }
}

export function* userSaga(): Generator<any, any, any> {
  yield takeEvery(fetchAllStudents, watchGetAllStudents);
  yield takeLatest(addStudent.type, watchAddNewStudent);
  yield takeLeading(editStudent.type, watchUpdateStudent);
  yield takeLeading(removeStudent, watchRemoveStudent);
}
