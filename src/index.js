import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import App from "./components/App";

const theme = extendTheme({
  fonts: {
    heading:
      "Inter, Roboto, \"Open Sans\", Lato, system-ui, -apple-system, sans-serif",
    body:
      "Inter, Roboto, \"Open Sans\", Lato, system-ui, -apple-system, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "#F5F7FB",
        color: "#0F1D3A",
      },
    },
  },
});

const root = createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
