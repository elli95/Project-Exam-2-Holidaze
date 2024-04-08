import { Link } from "react-router-dom";

function MenuNav() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/booking">Booking</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/registration">Registration</Link>
        </li>
        <li>
          <Link to="/profilePage">ProfilePage</Link>
        </li>
      </ul>
    </nav>
  );
}
export default MenuNav;
