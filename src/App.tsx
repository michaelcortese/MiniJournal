import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import Home from "./components/home";
import AuthCallback from "./components/auth/AuthCallback";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Home />
      </AuthProvider>
    ),
  },
  {
    path: "/auth/callback",
    element: (
      <AuthProvider>
        <AuthCallback />
      </AuthProvider>
    ),
  },
]);

export default function App() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  );
}
