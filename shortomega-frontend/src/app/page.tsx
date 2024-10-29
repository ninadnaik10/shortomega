"use client";
import Image from "next/image";
import styles from "./page.module.css";
import AppTheme from "@/shared-theme/AppTheme";
import { Box, Button, Paper, TextField } from "@mui/material";
import UrlTextField from "@/components/UrlTextField";
import { useRef } from "react";

export default function Home() {
  const inputRef = useRef(null);
  const handleClick = () => {
    console.log("Clicked");
    // @ts-ignore
    console.log(inputRef.current?.value);
  };
  return (
    <AppTheme>
      <h1>Shortomega</h1>
      <UrlTextField inputRef={inputRef} handleClick={handleClick} />
    </AppTheme>
  );
}
