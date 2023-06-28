import MusicPlayer from "./features/MusicPlayer/MusicPlayer";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import MusicLibraryLayout from "./layout/MusicLibraryLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
  },
  {
    path: "/music-library",
    element: <MusicLibraryLayout />,
    children: [{ index: true, element: <MusicPlayer /> }],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
