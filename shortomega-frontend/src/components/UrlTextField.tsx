import longUrlState from "@/atoms/longUrlState";
import {
  Box,
  TextField,
  Button,
  styled,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { useAtom } from "jotai";
import React, { useState } from "react";
import isErrorState from "@/atoms/isErrorState";
import axios from "axios";
import shortUrlState from "@/atoms/shortUrl";
import { LoadingButton } from "@mui/lab";
import { isValidUrl } from "@/utils/isValidUrl";

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (longUrl.trim() === "" || !isValidUrl(longUrl)) {
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
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "@media (max-width: 1054px)": {
          maxWidth: "90vw",
          fontSize: "1.5em",
        },
      }}
    >
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <TextField
            placeholder="Place your long URL here..."
            value={longUrl}
            variant="outlined"
            onChange={(e) => setLongUrl(e.target.value)}
            error={isError}
            helperText={isError ? "Please enter a URL." : null}
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
              // height: "4rem",
              width: "100%",
            }}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            color="primary"
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
      </form>
    </Box>
  );
};

export default UrlTextField;
