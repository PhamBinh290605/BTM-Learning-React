import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "../router";
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './utils/ThemeContext'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <AppRouter />
    </ThemeProvider>
  </StrictMode>,
);
