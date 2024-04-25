// import "./index.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import SearchField from "../SearchField";
import useLocalStorage from "../../hooks/useLocalStorage";

function HeaderNav() {
  const { accessToken, clearLocalStorage } = useLocalStorage();
  const [isSearchShown, setIsSearchShown] = useState(false);
  const [isNavShown, setIsNavShown] = useState(false);

  const handleSearchClick = () => {
    setIsSearchShown(!isSearchShown);
  };

  const handleNavClick = () => {
    setIsNavShown(!isNavShown);
  };

  // const accessToken = accessToken();
  const isLoggedIn = accessToken.length > 0;

  const handleLogoutClick = () => {
    clearLocalStorage();
    window.location.reload(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 flex justify-around items-center text-3xl p-3 bg-tahiti">
      <Link to="/">
        <h1 className="text-5xl">Holidaze</h1>
      </Link>
      <FontAwesomeIcon icon={faMagnifyingGlass} onClick={handleSearchClick} className="lg:hidden" />
      <div className={`flex ${isSearchShown ? "show" : "hidden"} absolute inset-x-0 top-16 p-2.5 justify-center bg-tahiti  lg:flex lg:static lg:p-0`}>
        <SearchField />
      </div>
      <FontAwesomeIcon icon={faBars} onClick={handleNavClick} className="md:hidden" />
      <nav className={`flex ${isNavShown ? "show" : "hidden"} absolute inset-x-0 top-16 p-20 justify-center bg-tahiti  md:flex md:static md:p-0`}>
        <ul className="flex flex-col text-center gap-10 md:flex-row">
          <li>
            <Link to="/">Home</Link>
          </li>
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/registration">Registration</Link>
              </li>
            </>
          )}
          {isLoggedIn && (
            <>
              <li>
                <Link to="/profilePage">Profile</Link>
              </li>
              <li>
                <Link to="/" onClick={handleLogoutClick}>
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
export default HeaderNav;
