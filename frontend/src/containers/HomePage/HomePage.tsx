import { Stack } from "@mui/material";
import Header from "../../components/Header/Header";
import AdminDataGridTable from "../../components/DataGridTable/AdminDataGridTable";
import ObserverDataGridTable from "../../components/DataGridTable/ObserverDataGridTable";

const HomePage = () => {
  return (
    <Stack spacing={20} justifyContent="center" alignItems="center">
      <Header />
      {/* <AdminDataGridTable /> */}
      <ObserverDataGridTable />
    </Stack>
  );
};

export default HomePage;
