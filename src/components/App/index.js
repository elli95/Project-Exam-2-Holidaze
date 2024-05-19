import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import "./index.css";
import Layout from "../PageLayout";
import HomePage from "../../pages/homePage";
// import BookingPage from "../../pages/bookingPage";
import LoginPage from "../../pages/loginPage";
import RegistrationPage from "../../pages/registrationPage";
import VenuePage from "../../pages/venuePage";
import ProfilePage from "../../pages/profilePage";
import PageNotFound from "../../pages/pageNotFound";

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
      // {
      //   path: "/booking",
      //   element: <BookingPage />,
      // },
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

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
