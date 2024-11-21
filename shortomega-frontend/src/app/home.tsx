"use client";
import Image from "next/image";
import styles from "./page.module.css";
import AppTheme from "@/shared-theme/AppTheme";
import { Box, Button, Paper, styled, TextField } from "@mui/material";
import UrlTextField from "@/components/UrlTextField";
import { useRef, useState } from "react";
import axios from "axios";
import shortUrlState from "@/atoms/shortUrl";
import { useAtomValue } from "jotai";
import longUrlState from "@/atoms/longUrlState";
import React from "react";
import { useAtom } from "jotai";
import ShortUrlResult from "../components/ShortUrlResult";
import isErrorState from "@/atoms/isErrorState";
import ColorModeSelect from "@/shared-theme/ColorModeSelect";
const StyledMainContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "50vh",
  width: "100vw",
  textAlign: "center",
  fontSize: "4rem",
  fontFamily: "Cantarell,sans-serif",
  fontWeight: "bold",
  // backgroundColor: "#f5f5f5",
});
export default function Home() {
  const inputRef = useRef(null);
  const [longUrl, setLongUrl] = useAtom(longUrlState);
  const [shortUrl, setShortUrl] = useAtom(shortUrlState);
  const [isError, setIsError] = useAtom(isErrorState);

  const clearState = () => {
    setShortUrl("");
    setLongUrl("");
    setIsError(false);
  };

  return (
    <>
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <StyledMainContainer>
        Shortomega
        <br />
        🔗✨
      </StyledMainContainer>
      {(shortUrl && <ShortUrlResult clearState={clearState} />) || (
        <UrlTextField />
      )}
    </>
  );
}
