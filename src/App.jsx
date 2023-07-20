import AppLayout from "./layout/AppLayout";
import { action as updateSong } from "./features/Update/UpdateModal";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import RootLayout, { loader as getUsersItemsRefs } from "./layout/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: getUsersItemsRefs,
    children: [
      {
        index: true,
        element: <AppLayout />,
        action: updateSong,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
