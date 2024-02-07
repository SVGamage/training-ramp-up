/* eslint-disable react-hooks/exhaustive-deps */
import dayjs from "dayjs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  fetchAllStudents,
  setUserFetchingError,
} from "../../redux/slice/studentSlice";
import {
  Box,
  Container,
  Grid,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { formatPhoneNumber } from "../../utility/formatPhoneNumber";
import { dataGridStyles } from "../../styles/dataGridStyles";
import PopupMessage from "../PopupMessage/PopupMessage";
// import io from "socket.io-client";
// const socket = io("http://localhost:5000");
// const socket = io("https://ramp-up-backend.onrender.com");
import { socket } from "../..";

function EditToolbar() {
  return (
    <GridToolbarContainer sx={{ padding: "0px" }}>
      <Grid sx={{ width: "100%" }}>
        <Grid item>
          <Typography
            padding="12px"
            sx={{ fontSize: "24px", fontWeight: 400, fontFamily: "Roboto" }}
          >
            Students Details
          </Typography>
        </Grid>
      </Grid>
    </GridToolbarContainer>
  );
}

const ObserverDataGridTable = () => {
  const initialRows: GridRowsProp = useSelector(
    (state: RootState) => state.student.students
  );
  const tableState: boolean = useSelector(
    (state: RootState) => state.student.isLoading
  );
  const fetchStudentsError: boolean = useSelector(
    (state: RootState) => state.student.userFetchingError
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllStudents());
  }, [dispatch]);

  useEffect(() => {
    socket.on("get_all_students", (data) => {
      console.log("getAll: ", data);
    });
  }, []);

  const columns: GridColDef[] = [
    {
      field: "id",
      type: "number",
      headerName: "ID",
      headerAlign: "left",
      align: "left",
      width: 60,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => {
        if (tableState) {
          return (
            <Box>
              <Skeleton animation="wave" height={15} width={30} />
            </Box>
          );
        }
        return params.value;
      },
      valueFormatter: (params) => {
        const id = Number(params.value);
        const formattedId = id.toString().padStart(2, "0");
        return formattedId;
      },
    },
    {
      field: "name",
      headerName: "Name",
      headerAlign: "left",
      align: "left",
      width: 100,
      sortable: true,
      editable: true,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (tableState) {
          return (
            <Box>
              <Skeleton animation="wave" height={15} width={50} />
            </Box>
          );
        }
        return params.value;
      },
    },
    {
      field: "gender",
      headerName: "Gender",
      headerAlign: "left",
      align: "left",
      type: "singleSelect",
      valueOptions: ["male", "Female", "Other"],
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      editable: true,
      renderCell: (params) => {
        if (tableState) {
          return (
            <Box>
              <Skeleton animation="wave" height={15} width={50} />
            </Box>
          );
        }
        return params.value;
      },
    },
    {
      field: "address",
      headerName: "Address",
      headerAlign: "left",
      align: "left",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      editable: true,
      renderCell: (params) => {
        if (tableState) {
          return (
            <Box>
              <Skeleton animation="wave" height={15} width={60} />
            </Box>
          );
        }
        return params.value;
      },
    },
    {
      field: "mobileno",
      headerName: "Mobile No:",
      headerAlign: "left",
      align: "left",
      sortable: false,
      disableColumnMenu: true,
      width: 150,
      editable: true,
      valueFormatter: (params) => {
        return formatPhoneNumber(params.value);
      },
      renderCell: (params) => {
        if (tableState) {
          return (
            <Box>
              <Skeleton animation="wave" height={15} width={80} />
            </Box>
          );
        }
        return params.value;
      },
    },
    {
      field: "dateofbirth",
      headerName: "Date of Birth",
      headerAlign: "left",
      align: "left",
      type: "date",
      valueFormatter: (params) => {
        const date = dayjs(params.value);
        return date.format("ddd MMM DD YYYY");
      },
      sortable: true,
      disableColumnMenu: true,
      editable: true,
      width: 205,
      renderCell: (params) => {
        if (tableState) {
          return (
            <Box>
              <Skeleton animation="wave" height={15} width={100} />
            </Box>
          );
        }
      },
    },
    {
      field: "age",
      headerName: "Age",
      headerAlign: "left",
      align: "left",
      type: "number",
      editable: true,
      disableColumnMenu: true,
      sortable: false,
      width: 100,
      renderCell: (params) => {
        if (tableState) {
          return (
            <Box>
              <Skeleton animation="wave" height={15} width={50} />
            </Box>
          );
        }
        return params.value;
      },
    },
  ];

  return (
    <>
      <Container>
        <Paper
          sx={{
            height: "auto",
            width: "81.3%",
            margin: "auto",
          }}
        >
          <DataGrid
            rows={initialRows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            getRowHeight={() => "auto"}
            onProcessRowUpdateError={(error) => console.error(error)}
            slots={{
              toolbar: EditToolbar,
            }}
            sx={dataGridStyles.gridStyles}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        </Paper>
      </Container>

      {fetchStudentsError && (
        <PopupMessage
          open={fetchStudentsError}
          title={"Unable fetch students details.Please try again later"}
          handleClickSecondButton={() => {
            // dispatch(setIsLoading(false));
            dispatch(setUserFetchingError(false));
          }}
          secondButtonName="Try again"
        />
      )}
    </>
  );
};

export default ObserverDataGridTable;
