import { Link } from "react-router-dom";
import SearchField from "../SearchField";

// import { API_VENUES } from "../../shared/apis";
// import useFetchApi from "../../hooks/useFetchApi";

function MenuNav() {
  // const venueData = useFetchApi(API_VENUES);

  return (
    <div>
      <h1>Holidaze</h1>
      <div>
        <SearchField />
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/registration">Registration</Link>
          </li>
          <li>
            <Link to="/profilePage">Profile</Link>
          </li>
          <li>
            <Link to="/">Logout</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
export default MenuNav;
