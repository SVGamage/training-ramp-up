/* eslint-disable react-hooks/exhaustive-deps */
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  addStudent,
  addStudentError,
  editStudent,
  fetchAllStudents,
  removeStudent,
  removeStudentError,
  setIsLoading,
  setRemoveStudentError,
  setUserAddingError,
  setUserFetchingError,
  setUserUpdatingError,
  updateStudent,
  updateStudentError,
} from "../../redux/slice/studentSlice";
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridToolbarContainer,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { formatPhoneNumber } from "../../utility/formatPhoneNumber";
import { ageCalculator } from "../../utility/ageCalculator";
import { validatePhoneNumber } from "../../utility/validatePhoneNumber";
import { dataGridStyles } from "../../styles/dataGridStyles";
import PopupMessage from "../PopupMessage/PopupMessage";
import io from "socket.io-client";
import AddNewUserForm from "../AddNewUserForm/AddNewUserForm";
// const socket = io("https://ramp-up-backend.onrender.com");
const socket = io("http://localhost:5000");

let idValue = 0;

const uniqueIdGenerator = () => {
  idValue += 1;
  return idValue;
};

const idReducer = () => {
  idValue -= 1;
};

interface IEditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  setOpenAddNewUser: (value: boolean) => void;
}

function EditToolbar(props: IEditToolbarProps) {
  idValue = useSelector((state: RootState) => state.student.students).reduce(
    (maxId, obj) => Math.max(maxId, obj.id),
    0
  );
  const currentRows = useSelector((state: RootState) => state.student.students);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 400px)");
  const { setRowModesModel, setOpenAddNewUser } = props;

  const handleOpenAddNewUser = () => {
    setOpenAddNewUser(true);
  };

  const handleClick = () => {
    const id = uniqueIdGenerator();
    dispatch(
      updateStudent([
        {
          id,
          name: "",
          gender: "",
          address: "",
          mobileno: "",
          dateofbirth: dayjs(new Date()).toISOString().slice(0, 10),
          age: "",
          isNew: true,
        },
        ...currentRows,
      ])
    );
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer sx={{ padding: "0px" }}>
      <Grid sx={{ width: "100%" }}>
        <Grid
          item
          sx={{
            backgroundColor: "rgba(33, 150, 243, 0.4)",
            borderRadius: "4px 4px 0px 0px",
          }}
        >
          <Grid
            container={isMobile ? false : true}
            justifyContent="flex-end"
            alignItems="flex-end"
            padding="12px"
          >
            <Grid item>
              <Button
                size="small"
                variant="contained"
                onClick={handleOpenAddNewUser}
                sx={{ backgroundColor: "rgba(33, 150, 243, 1)" }}
              >
                Add New User
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Typography
            padding="12px"
            sx={{ fontSize: "24px", fontWeight: 400, fontFamily: "Roboto" }}
          >
            User Details
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container={isMobile ? false : true}
        justifyContent="flex-end"
        alignItems="flex-end"
        padding="12px"
      >
        <Grid item>
          <Button
            size="small"
            variant="contained"
            onClick={handleClick}
            sx={{ backgroundColor: "rgba(33, 150, 243, 1)" }}
          >
            Add New
          </Button>
        </Grid>
      </Grid>
    </GridToolbarContainer>
  );
}

const AdminDataGridTable = () => {
  const initialRows: GridRowsProp = useSelector(
    (state: RootState) => state.student.students
  );
  const tableState: boolean = useSelector(
    (state: RootState) => state.student.isLoading
  );
  const studentAddingError: boolean = useSelector(
    (state: RootState) => state.student.userAddingError
  );
  const studentUpdatingError: boolean = useSelector(
    (state: RootState) => state.student.userUpdatingError
  );
  const studentRemovingError: boolean = useSelector(
    (state: RootState) => state.student.removeStudentError
  );
  const fetchStudentsError: boolean = useSelector(
    (state: RootState) => state.student.userFetchingError
  );
  const dispatch = useDispatch();
  const [numbervalidateError, setNumberValidateError] = useState(false);
  const [agevalidateError, setAgeValidateError] = useState(false);
  const [keepEditingPopup, setKeepEditingPopup] = useState(false);
  const [addedSuccessfullyPopup, setAddedSuccessfullyPopup] = useState(false);
  const [editedSuccessfullyPopup, setEditedSuccessfullyPopup] = useState(false);
  const [removedSuccessfullyPopup, setRemovedSuccessfullyPopup] =
    useState(false);
  const [discardChangesPopup, setDiscardChangesPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [currentRowId, setCurrentRowId] = useState<GridRowId | null>(null);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [openAddNewuser, setOpenAddNewUser] = useState(false);
  const [emailSentSuccesfully, setEmailSentSuccesfully] = useState(false);
  const [emailSendFailed, setEmailSendFailed] = useState(false);

  useEffect(() => {
    dispatch(fetchAllStudents());
  }, [dispatch]);

  useEffect(() => {
    socket.on("get_all_students", (data) => {
      console.log("getAll: ", data);
    });
    socket.on("create_new_student", (data) => {
      if (data === 201) {
        setAddedSuccessfullyPopup(true);
        dispatch(fetchAllStudents());
      }
      if (data === 500) {
        dispatch(addStudentError());
      }
    });
    socket.on("update_student", (data) => {
      if (data === 201) {
        setEditedSuccessfullyPopup(true);
        dispatch(fetchAllStudents());
      }
      if (data === 500) {
        dispatch(updateStudentError());
      }
    });
    socket.on("remove_student", (data) => {
      if (data === 204) {
        setRemovedSuccessfullyPopup(true);
        dispatch(fetchAllStudents());
      }
      if (data === 500) {
        dispatch(removeStudentError());
      }
    });
    socket.on("send_email", (data) => {
      if (data === 200) {
        setEmailSentSuccesfully(true);
      } else if (data === 400 || data === 500) {
        setEmailSendFailed(true);
      }
    });
  }, []);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setDeletePopup(true);
    setCurrentRowId(id);
  };

  const handleConfirmDeleteClick = (id: GridRowId) => {
    dispatch(updateStudent(initialRows.filter((row) => row.id !== id)));
    dispatch(removeStudent(id));
    idReducer();
  };

  const handleDiscardClick = (id: GridRowId) => () => {
    setDiscardChangesPopup(true);
    setCurrentRowId(id);
  };

  const handleConfirmClick = (id: GridRowId) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = initialRows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      dispatch(updateStudent(initialRows.filter((row) => row.id !== id)));
    }
    idReducer();
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const student: GridValidRowModel = {
      id: newRow.id,
      name: newRow.name,
      gender: newRow.gender,
      address: newRow.address,
      mobileno: newRow.mobileno,
      dateofbirth:
        typeof newRow.dateofbirth === "string"
          ? newRow.dateofbirth
          : newRow.dateofbirth.toISOString().slice(0, 10),
      age: newRow.age,
    };
    const updatedRow = {
      ...newRow,
      dateofbirth:
        typeof newRow.dateofbirth === "string"
          ? newRow.dateofbirth
          : newRow.dateofbirth.toISOString(),
      isNew: false,
    };
    const isPhoneNumberValid = validatePhoneNumber(newRow.mobileno);
    const isAgeValid = newRow.age > 18;

    if (newRow.name === "" || newRow.gender === "" || newRow.address === "") {
      setKeepEditingPopup(true);

      return {};
    }
    if (!isPhoneNumberValid && !isAgeValid) {
      setNumberValidateError(true);
      setAgeValidateError(true);
      return {};
    }
    if (!isPhoneNumberValid) {
      setNumberValidateError(true);
      return {};
    }
    if (!isAgeValid) {
      setAgeValidateError(true);
      return {};
    }

    try {
      if ("isNew" in newRow) {
        dispatch(addStudent(student));
      } else {
        dispatch(editStudent(student));
      }
      dispatch(
        updateStudent(
          initialRows.map((row) => (row.id === newRow.id ? updatedRow : row))
        )
      );
      setAgeValidateError(false);
      setNumberValidateError(false);
      // if (newRow!.isNew) {
      //   setAddedSuccessfullyPopup(true);
      // } else {
      //   setEditedSuccessfullyPopup(true);
      // }
    } catch (error) {
      console.error(error);
      return {};
    }
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
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
      renderEditCell: (params: GridRenderCellParams<any, string>) => (
        <TextField
          size="small"
          value={params.value as string}
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            })
          }
          sx={dataGridStyles.textFieldStyles}
        />
      ),
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
      renderEditCell: (params: GridRenderCellParams<any, string>) => (
        <Select
          size="small"
          fullWidth
          value={params.value as string}
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            })
          }
          sx={dataGridStyles.genderFieldStyles}
        >
          <MenuItem value={"Male"}>Male</MenuItem>
          <MenuItem value={"Female"}>Female</MenuItem>
          <MenuItem value={"Other"}>Other</MenuItem>
        </Select>
      ),
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
      renderEditCell: (params: GridRenderCellParams<any, string>) => (
        <TextField
          size="small"
          value={params.value as string}
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            })
          }
          sx={dataGridStyles.textFieldStyles}
        />
      ),
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
      renderEditCell: (params: GridRenderCellParams<any, string>) => (
        <TextField
          size="small"
          value={params.value as string}
          onChange={(e) =>
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: e.target.value,
            })
          }
          InputProps={{
            sx: {
              boxShadow: "0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
            },
          }}
          sx={{
            ...dataGridStyles.mobileFieldStyles,
            "& .MuiOutlinedInput-root": {
              borderRadius: 0,
              border: numbervalidateError
                ? ""
                : "1px solid rgba(33, 150, 243, 1)",
            },
            marginTop: numbervalidateError ? "35px" : "0px",
          }}
          error={numbervalidateError}
          helperText={
            numbervalidateError ? "Please enter a valid phone number" : null
          }
        />
      ),
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
      renderEditCell: (
        params: GridRenderCellParams<any, dayjs.Dayjs | null>
      ) => {
        const dateValue = params.value ? dayjs(params.value) : null;
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DatePicker"]}
              sx={{ paddingTop: "0px" }}
            >
              <DatePicker
                value={dateValue}
                disableFuture
                onChange={(newValue) => {
                  params.api.setEditCellValue({
                    id: params.id,
                    field: params.field,
                    value: newValue,
                  });
                  params.api.setEditCellValue({
                    id: params.id,
                    field: "age",
                    value: ageCalculator(newValue),
                  });
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: dataGridStyles.birthdayFieldStyles,
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        );
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
      renderEditCell: (params: GridRenderCellParams<any, string>) => (
        <TextField
          size="small"
          value={params.value as string}
          error={agevalidateError}
          helperText={
            agevalidateError
              ? "individual is below the minimum age allowed"
              : null
          }
          InputProps={{
            sx: {
              boxShadow: "0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
            },
          }}
          sx={{
            ...dataGridStyles.ageFieldStyles,
            "& .MuiOutlinedInput-root": {
              border: numbervalidateError
                ? ""
                : "1px solid rgba(33, 150, 243, 1)",
              borderRadius: 0,
            },
            marginTop: agevalidateError ? "33px" : "0px",
          }}
        />
      ),
    },

    {
      field: "actions",
      type: "actions",
      headerAlign: "left",
      align: "left",
      headerName: "Action",
      width: 215,
      cellClassName: "actions",

      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        const editedRow = initialRows.find((row) => row.id === id);
        if (tableState) {
          return [
            <Box>
              <Stack direction="row" spacing={1} paddingY="10px">
                <Skeleton animation="wave" height={30} width={50} />
                <Skeleton animation="wave" height={30} width={60} />
              </Stack>
            </Box>,
          ];
        }
        if (isInEditMode) {
          if (editedRow!.isNew) {
            return [
              <Stack direction="column" spacing={1} paddingY="10px">
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={handleSaveClick(id)}
                  sx={{ width: "30px", fontSize: "13px", fontWeight: 500 }}
                >
                  Add
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={handleDiscardClick(id)}
                  sx={{
                    width: "145px",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  Discard Changes
                </Button>
              </Stack>,
            ];
          }
          return [
            <Stack direction="row" spacing={1} paddingY="10px">
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={handleSaveClick(id)}
                sx={{ fontSize: "13px", fontWeight: 500 }}
              >
                Update
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={handleDiscardClick(id)}
                sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
            </Stack>,
          ];
        }

        return [
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={handleEditClick(id)}
              sx={{ fontSize: "13px", fontWeight: 500 }}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={handleDeleteClick(id)}
              sx={{ fontSize: "13px", fontWeight: 500 }}
            >
              Remove
            </Button>
          </Stack>,
        ];
      },
    },
  ];

  return (
    <>
      <Container>
        <Paper
          sx={{
            height: "auto",
            width: "100%",
          }}
        >
          <DataGrid
            rows={initialRows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            getRowHeight={() => "auto"}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => console.error(error)}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: { setRowModesModel, setOpenAddNewUser },
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
      {keepEditingPopup && (
        <PopupMessage
          open={keepEditingPopup}
          title={"Mandatory fields are missing."}
          handleClickSecondButton={() => setKeepEditingPopup(false)}
          secondButtonName="Keep Editing"
        />
      )}
      {addedSuccessfullyPopup && (
        <PopupMessage
          open={addedSuccessfullyPopup}
          title={"A new student added successfully."}
          handleClickSecondButton={() => setAddedSuccessfullyPopup(false)}
          secondButtonName="Ok"
        />
      )}
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
      {studentAddingError && (
        <PopupMessage
          open={studentAddingError}
          title={"Unable to add a new student.Please try again later"}
          handleClickSecondButton={() => {
            dispatch(setIsLoading(false));
            dispatch(setUserAddingError(false));
          }}
          secondButtonName="Try again"
        />
      )}
      {editedSuccessfullyPopup && (
        <PopupMessage
          open={editedSuccessfullyPopup}
          title={"Student detailes updated successfully."}
          handleClickSecondButton={() => setEditedSuccessfullyPopup(false)}
          secondButtonName="Ok"
        />
      )}
      {removedSuccessfullyPopup && (
        <PopupMessage
          open={removedSuccessfullyPopup}
          title={"Student removed successfully."}
          handleClickSecondButton={() => setRemovedSuccessfullyPopup(false)}
          secondButtonName="Ok"
        />
      )}
      {studentUpdatingError && (
        <PopupMessage
          open={studentUpdatingError}
          title={"Cannot update student details.Please try again later"}
          handleClickSecondButton={() => {
            dispatch(setIsLoading(false));
            dispatch(setUserUpdatingError(false));
          }}
          secondButtonName="Try again"
        />
      )}
      {studentRemovingError && (
        <PopupMessage
          open={studentRemovingError}
          title={"Cannot Remove the student.Please try again later"}
          handleClickSecondButton={() => {
            dispatch(setIsLoading(false));
            dispatch(setRemoveStudentError(false));
          }}
          secondButtonName="Try again"
        />
      )}
      {discardChangesPopup && (
        <PopupMessage
          open={discardChangesPopup}
          title={"Discard changes?"}
          handleClickFirstButton={() => setDiscardChangesPopup(false)}
          handleClickSecondButton={() => {
            handleConfirmClick(currentRowId as GridRowId);
            setDiscardChangesPopup(false);
          }}
          firstButtonName="Dismiss"
          secondButtonName="Confirm"
        />
      )}
      {deletePopup && (
        <PopupMessage
          open={deletePopup}
          title={"Are you sure you want to remove this student?"}
          handleClickFirstButton={() => setDeletePopup(false)}
          handleClickSecondButton={() => {
            handleConfirmDeleteClick(currentRowId as GridRowId);
            setDeletePopup(false);
          }}
          firstButtonName="Dismiss"
          secondButtonName="Confirm"
        />
      )}
      {openAddNewuser && (
        <AddNewUserForm
          openPopup={openAddNewuser}
          closePopup={() => {
            setOpenAddNewUser(false);
          }}
        />
      )}
      {emailSentSuccesfully && (
        <PopupMessage
          open={emailSentSuccesfully}
          title={
            "A password creation link has been sent to the provided email address."
          }
          handleClickSecondButton={() => {
            setEmailSentSuccesfully(false);
            setOpenAddNewUser(false);
          }}
          secondButtonName="Ok"
        />
      )}
      {emailSendFailed && (
        <PopupMessage
          open={emailSendFailed}
          title={
            "Failed to send the password creation link. Please try again later."
          }
          handleClickSecondButton={() => {
            setEmailSendFailed(false);
            setOpenAddNewUser(false);
          }}
          secondButtonName="Try again later"
        />
      )}
    </>
  );
};

export default AdminDataGridTable;
