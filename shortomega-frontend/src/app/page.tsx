"use client";

import Home from "@/app/home";
import AppTheme from "@/shared-theme/AppTheme";
import { Provider } from "jotai";

export default function RootPage() {
  return (
    <Provider>
      <AppTheme>
        <Home />
      </AppTheme>
    </Provider>
  );
}
