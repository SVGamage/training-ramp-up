/* eslint-disable react-hooks/exhaustive-deps */
import { Navigate } from "react-router-dom";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyUsers } from "../../redux/slice/userSlice";

import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { RootState } from "../../redux/store";

const ProtectedRoute = ({ children }: any) => {
  const isAuthorized = useSelector(
    (state: RootState) => state.user.isAuthorized
  );
  const authorizationError = useSelector(
    (state: RootState) => state.user.authorizationError
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyUsers());
  }, []);

  if (isAuthorized === true) {
    return children;
  } else {
    if (authorizationError === true) {
      return <Navigate to={"/login"} replace />;
    }
    return <LoadingComponent />;
  }
};
export default ProtectedRoute;
