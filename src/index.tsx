import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider } from "@/components/ui/color-mode";
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
