"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/store/store";

export default function Providers({ children }) {
  const store = makeStore(); // <-- TANPA preloadedState
  return <Provider store={store}>{children}</Provider>;
}
