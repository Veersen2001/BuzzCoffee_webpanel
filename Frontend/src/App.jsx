import { createBrowserRouter, RouterProvider } from "react-router-dom";

import frontendRoutes from "@/routes/frontendRoutes";
import panelRestaurantRoutes from "@/routes/panelRestaurantRoutes";
import { AuthProvider } from "./context/auth-context";


function App() {
  const router = createBrowserRouter([
    ...frontendRoutes,
    ...panelRestaurantRoutes,
  ]);

  return (
    <AuthProvider>
     
        <RouterProvider router={router} />
     
    </AuthProvider>
  );
}

export default App;
