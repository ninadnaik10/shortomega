import { Box, IconButton, styled } from "@mui/material";
import { useAtomValue } from "jotai";
import React, { useState } from "react";
import shortUrlState from "@/atoms/shortUrl";
import { QRCodeSVG } from "qrcode.react";
import longUrlState from "@/atoms/longUrlState";
import CopyIcon from "@mui/icons-material/FileCopy";
import DoneIcon from "@mui/icons-material/Done";

const StyledMainContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  fontSize: "1.5em",
  maxWidth: "70vw",
  padding: "2rem",
  borderRadius: "16px",
  justifyContent: "space-between",
  margin: "auto",
  background: "rgba( 35, 35, 35, 0.25 )",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
});

const StyledUrlContainer = styled(Box)({
  borderRadius: "16px",
  padding: "1rem",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  width: "100%",
  margin: "0 1rem 0 0",
  overflow: "hidden",
  maxWidth: "45vw",
  textWrap: "wrap",
});

export default function ShortUrlResult() {
  const shortUrl = useAtomValue(shortUrlState);
  const longUrl = useAtomValue(longUrlState);
  const [toggleIcon, setToggleIcon] = useState([false, false]);

  const copyText = (value: string, idx: number) => {
    // firefox does not support navigator.clipboard.writeText

    navigator.clipboard.writeText(value);
    setToggleIcon((prev) => {
      return prev.map((_, i) => (i === idx ? !prev[i] : prev[i]));
    });
  };
  return (
    <div>
      <StyledMainContainer>
        {/* <StyledUrlContainer> */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          Long URL
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <StyledUrlContainer>{longUrl}</StyledUrlContainer>
            <IconButton onClick={() => copyText(longUrl, 0)}>
              {(!toggleIcon[0] && <CopyIcon />) || <DoneIcon />}
            </IconButton>
          </Box>
          Short URL
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <StyledUrlContainer>{shortUrl}</StyledUrlContainer>
            <IconButton onClick={() => copyText(shortUrl, 1)}>
              {(!toggleIcon[1] && <CopyIcon />) || <DoneIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* </StyledUrlContainer> */}
        <QRCodeSVG value={shortUrl} size={154} marginSize={1} radius={10} />
      </StyledMainContainer>
    </div>
  );
}
