import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const LoadingComponent = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
};
export default LoadingComponent;
