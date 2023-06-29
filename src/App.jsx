import MusicPlayer from "./features/App/MusicPlayer";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import AppLayout, { loader as getUsersItemsRefs } from "./layout/AppLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
  },
  {
    path: "/app",
    element: <AppLayout />,
    loader: getUsersItemsRefs,
    children: [{ index: true, element: <MusicPlayer /> }],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
