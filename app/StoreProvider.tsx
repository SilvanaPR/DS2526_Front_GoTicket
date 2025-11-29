"use client";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import { useEffect } from "react";
import { hydrateFromStorage } from "../lib/features/auth/authSlice";

export default function StoreProvider({ children }) {
  useEffect(() => {
    store.dispatch(hydrateFromStorage());
  }, []);
  return <Provider store={store}>{children}</Provider>;
}