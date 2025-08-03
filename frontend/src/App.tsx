import "./global.css";

import { Helmet, HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import { ThemeProvider } from "./components/theme/theme-provider";
import { router } from "./routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider storageKey="vibrante-theme" defaultTheme="dark">
        <Helmet titleTemplate="%s | Shop-managin" />
        <Toaster richColors />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}></RouterProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
