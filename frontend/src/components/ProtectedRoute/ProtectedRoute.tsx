import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(verifyUsers());
  }, [dispatch]);

  useEffect(() => {
    console.log("isAuthorized:", isAuthorized);
    console.log("authorizationError:", authorizationError);
  }, [isAuthorized, authorizationError]);

  if (isAuthorized === true) {
    return children;
  } else {
    if (authorizationError === true) {
      navigate("/login", { replace: true });
    }
    return <LoadingComponent />;
  }
};
export default ProtectedRoute;
