import { Box, TextField, Button, styled } from "@mui/material";
import React, { MutableRefObject } from "react";

const UrlTextField = ({
  inputRef,
  handleClick,
}: {
  inputRef: MutableRefObject<null>;
  handleClick: () => void;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",

        maxWidth: "70vw",
        borderRadius: "16px",
        justifyContent: "center",
        margin: "auto",
      }}
    >
      <div style={{ display: "flex", width: "100%" }}>
        <TextField
          // variant="outlined"
          placeholder="Place your long URL here..."
          inputRef={inputRef}
          sx={{
            width: "100%",
            borderRadius: 0,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          sx={{
            borderRadius: "0 16px 16px 0", // Rounded corners on the right
            marginLeft: "-1px", // Adjust spacing between button and TextField
            whiteSpace: "nowrap", // Prevent button text from wrapping
          }}
        >
          Shorten URL
        </Button>
      </div>
    </Box>
  );
};

export default UrlTextField;
