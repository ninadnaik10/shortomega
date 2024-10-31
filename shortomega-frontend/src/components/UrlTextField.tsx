import longUrlState from "@/atoms/longUrlState";
import {
  Box,
  TextField,
  Button,
  styled,
  FormControl,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { useAtom } from "jotai";
import React, { useState } from "react";
import isErrorState from "@/atoms/isErrorState";
import axios from "axios";
import shortUrlState from "@/atoms/shortUrl";
import { LoadingButton } from "@mui/lab";

const FRONT_END_URL = process.env.NEXT_PUBLIC_SHORT_HOST;

const UrlTextField = () => {
  const [longUrl, setLongUrl] = useAtom(longUrlState);
  const [isError, setIsError] = useAtom(isErrorState);
  const [_, setShortUrl] = useAtom(shortUrlState);
  const [loading, setLoading] = useState(false);

  const shortenUrl = async () => {
    // @ts-ignore
    const res = await axios.post("/api/shorten", {
      url: longUrl,
    });
    const hash = res.data.data.hash;
    const shortUrl = `${FRONT_END_URL}/${hash}`;
    console.log(shortUrl);
    setShortUrl(shortUrl);
  };

  const handleSubmit = async () => {
    if (longUrl.trim() === "") {
      setIsError(true);
    } else {
      setIsError(false);
      setLoading(true);
      await shortenUrl();
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        fontSize: "2em",
        maxWidth: "70vw",
        borderRadius: "16px",
        margin: "auto",
        // height: "100px",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
        }}
      >
        <FormControl error={isError} variant="outlined" sx={{ width: "100%" }}>
          <TextField
            placeholder="Place your long URL here..."
            value={longUrl}
            variant="outlined"
            onChange={(e) => setLongUrl(e.target.value)}
            slotProps={{
              input: {
                sx: {
                  height: "4rem",
                  borderRadius: "16px 0 0 16px",
                  fontSize: "0.65em",
                },
              },
            }}
            sx={{
              height: "4rem",
            }}
          />
          {isError && <FormHelperText>Please enter a URL.</FormHelperText>}
        </FormControl>
        <LoadingButton
          variant="contained"
          loading={loading}
          color="primary"
          onClick={handleSubmit}
          loadingIndicator={<CircularProgress color="secondary" size={24} />}
          sx={{
            borderRadius: "0 24px 24px 0",
            height: "4rem",
            fontSize: "0.65em",

            whiteSpace: "nowrap",
          }}
        >
          Shorten URL
        </LoadingButton>
      </div>
    </Box>
  );
};

export default UrlTextField;
