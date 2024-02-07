import { Stack } from "@mui/material";
import Header from "../../components/Header/Header";
import AdminDataGridTable from "../../components/DataGridTable/AdminDataGridTable";
import ObserverDataGridTable from "../../components/DataGridTable/ObserverDataGridTable";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import { useDispatch, useSelector } from "react-redux";
import { logoutUsers } from "../../redux/slice/userSlice";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import { RootState } from "../../redux/store";

const HomePage = () => {
  const [open, setOpen] = useState(false);
  const currentRole = useSelector((state: RootState) => state.user.userRole);
  const location = useLocation();
  const userRole = (location.state && location.state.role) || currentRole;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onIdle = () => {
    dispatch(logoutUsers());
    navigate("/login");
  };

  const onActive = () => {};

  const onAction = () => {};
  const onPrompt = () => {
    setOpen(true);
  };

  const { start } = useIdleTimer({
    onIdle,
    onActive,
    onAction,
    onPrompt,
    timeout: 1000 * 60 * 30,
    promptBeforeIdle: 1000 * 60 * 20,
    throttle: 500,
  });
  return (
    <>
      <Stack spacing={20} justifyContent="center" alignItems="center">
        <Header />
        {userRole === "Admin" ? (
          <AdminDataGridTable />
        ) : (
          <ObserverDataGridTable />
        )}
      </Stack>
      {open && (
        <PopupMessage
          open={open}
          title="Keep Login..."
          handleClickSecondButton={() => {
            start();
            setOpen(false);
          }}
          secondButtonName="Ok"
        />
      )}
    </>
  );
};

export default HomePage;
