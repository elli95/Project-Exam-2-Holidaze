import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import "./index.css";
import Layout from "../PageLayout";
import HomePage from "../../pages/homePage";
import LoginPage from "../../pages/loginPage";
import RegistrationPage from "../../pages/registrationPage";
import VenuePage from "../../pages/venuePage";
import ProfilePage from "../../pages/profilePage";
import PageNotFound from "../../pages/pageNotFound";

/**
 * Defines the routes for the application using react-router-dom's createBrowserRouter.
 *
 * Routes:
 * - "/" (HomePage)
 * - "/venue/:id" (VenuePage)
 * - "/login" (LoginPage)
 * - "/registration" (RegistrationPage)
 * - "/profilePage" (ProfilePage)
 * - "*" (PageNotFound)
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/venue/:id",
        element: <VenuePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/registration",
        element: <RegistrationPage />,
      },
      {
        path: "/profilePage",
        element: <ProfilePage />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

/**
 * Root component of the application that provides routing using RouterProvider.
 *
 * @component
 */
function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
