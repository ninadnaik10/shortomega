import { Box, IconButton, styled } from "@mui/material";
import { useAtomValue } from "jotai";
import React, { useRef, useState } from "react";
import shortUrlState from "@/atoms/shortUrl";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import longUrlState from "@/atoms/longUrlState";
import CopyIcon from "@mui/icons-material/FileCopy";
import DoneIcon from "@mui/icons-material/Done";
import { Download } from "@mui/icons-material";
import {
  copyCanvasToClipboard,
  copyText,
  onCanvasButtonClick,
} from "@/utils/copyAndDownloadQr";

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
  "@media (max-width: 1054px)": {
    flexDirection: "column",
    justifyContent: "space-between",
  },
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
  "@media (max-width: 1054px)": {
    margin: "0 1rem 1rem 0",
  },
});

const StyledParagraph = styled("p")({
  margin: "1em 0",
  "&:first-of-type": {
    marginTop: 0,
  },
  fontSize: "0.85em",
});

export default function ShortUrlResult() {
  const shortUrl = useAtomValue(shortUrlState);
  const longUrl = useAtomValue(longUrlState);
  const [toggleIcon, setToggleIcon] = useState([false, false, false]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  return (
    <div>
      <StyledMainContainer>
        {/* <StyledUrlContainer> */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <StyledParagraph>Long URL</StyledParagraph>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <StyledUrlContainer>{longUrl}</StyledUrlContainer>
            <IconButton onClick={() => copyText(longUrl, 0, setToggleIcon)}>
              {(!toggleIcon[0] && <CopyIcon />) || <DoneIcon />}
            </IconButton>
          </Box>
          <StyledParagraph>Short URL</StyledParagraph>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <StyledUrlContainer>{shortUrl}</StyledUrlContainer>
            <IconButton onClick={() => copyText(shortUrl, 1, setToggleIcon)}>
              {(!toggleIcon[1] && <CopyIcon />) || <DoneIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* </StyledUrlContainer> */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "auto 0",
            justifyContent: "space-around",
          }}
        >
          <QRCodeCanvas
            value={shortUrl}
            size={175}
            level="M"
            marginSize={1}
            //@ts-ignore
            ref={canvasRef}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "1rem 0",
              justifyContent: "space-around",
            }}
          >
            <IconButton
              onClick={() => copyCanvasToClipboard(canvasRef, setToggleIcon)}
            >
              {(!toggleIcon[2] && <CopyIcon />) || <DoneIcon />}
            </IconButton>
            <IconButton onClick={() => onCanvasButtonClick(canvasRef)}>
              <Download />
            </IconButton>
          </div>
        </div>
      </StyledMainContainer>
    </div>
  );
}
