import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider } from "@/components/ui/color-mode";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import App from "@/components/App";
import { BoardProvider } from "@/state/BoardContext";
import { system } from "@/theme";
import { store } from "@/store";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
const root = createRoot(rootElement);
root.render(
  <Provider store={store}>
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <BoardProvider>
          <App />
        </BoardProvider>
      </ColorModeProvider>
    </ChakraProvider>
  </Provider>,
);
