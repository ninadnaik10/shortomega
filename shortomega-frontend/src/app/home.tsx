"use client";
import Image from "next/image";
import styles from "./page.module.css";
import AppTheme from "@/shared-theme/AppTheme";
import {
  Box,
  Button,
  Container,
  Paper,
  styled,
  TextField,
} from "@mui/material";
import UrlTextField from "@/components/UrlTextField";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import shortUrlState from "@/atoms/shortUrl";
import { useAtomValue } from "jotai";
import longUrlState from "@/atoms/longUrlState";
import React from "react";
import { useAtom } from "jotai";
import ShortUrlResult from "../components/ShortUrlResult";
import isErrorState from "@/atoms/isErrorState";
import ColorModeSelect from "@/shared-theme/ColorModeSelect";
import { ArrowForward } from "@mui/icons-material";
import { Icon } from "@mui/material";
import { useRouter } from "next/navigation";

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

const StyledFixedContainer = styled(Box)({
  position: "fixed",
  top: "1rem",
  right: "1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledRegisterButton = styled(Button)({
  margin: "0 1rem",
  fontSize: "1rem",
});

const StyledProfileContainer = styled(Container)({
  margin: "0 1rem",
  fontSize: "1rem",
  display: "flex",
});

export default function Home() {
  const inputRef = useRef(null);
  const [longUrl, setLongUrl] = useAtom(longUrlState);
  const [shortUrl, setShortUrl] = useAtom(shortUrlState);
  const [isError, setIsError] = useAtom(isErrorState);
  const router = useRouter();

  const clearState = () => {
    setShortUrl("");
    setLongUrl("");
    setIsError(false);
  };

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  return (
    <>
      <StyledFixedContainer>
        <ColorModeSelect />
        {(!token && (
          <StyledRegisterButton
            variant="contained"
            color="primary"
            onClick={() => router.push("/sign-up")}
          >
            Register{" "}
            <Icon>
              <ArrowForward fontSize="small" />
            </Icon>
          </StyledRegisterButton>
        )) || <StyledProfileContainer>Profile</StyledProfileContainer>}
      </StyledFixedContainer>
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
