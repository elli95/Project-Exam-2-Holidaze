import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import SearchField from "../SearchField";
import useLocalStorage from "../../hooks/useLocalStorage";

/**
 * HeaderNav component renders the navigation bar for the Holidaze application.
 * It includes the brand logo, search button, and navigation menu with login/logout functionality.
 *
 * @component
 * @returns {JSX.Element} The rendered header navigation component.
 */

function HeaderNav() {
  const { accessToken, clearLocalStorage } = useLocalStorage();
  const [isSearchShown, setIsSearchShown] = useState(false);
  const [isNavShown, setIsNavShown] = useState(false);

  /**
   * Toggles the visibility of the search field.
   */
  const handleSearchClick = () => {
    setIsSearchShown(!isSearchShown);
  };

  /**
   * Toggles the visibility of the navigation menu.
   */
  const handleNavClick = () => {
    setIsNavShown(!isNavShown);
  };

  /**
   * Hides both the search field and navigation menu.
   */
  const handleHideMenus = () => {
    setIsSearchShown(false);
    setIsNavShown(false);
  };

  const isLoggedIn = accessToken.length > 0;

  /**
   * Clears the local storage and redirects to the homepage on logout.
   */
  const handleLogoutClick = () => {
    clearLocalStorage();
    window.location.href = "/";
  };

  return (
    <header className="headerImg imgCover fixed z-20 inset-x-0 top-0 flex justify-around items-center text-3xl p-3 bg-black">
      <Link to="/">
        <h1 className="text-5xl text-white">Holidaze</h1>
      </Link>
      <FontAwesomeIcon icon={faMagnifyingGlass} onClick={handleSearchClick} className="lg:hidden text-white" aria-label="Search" />
      <div
        className={`flex ${
          isSearchShown ? "show" : "hidden"
        } absolute headerImg headerSearch imgCover rounded bg-black inset-x-0 top-16 p-2.5 justify-center  lg:flex lg:static lg:p-0`}
      >
        <SearchField onLinkClick={handleHideMenus} />
      </div>
      <FontAwesomeIcon icon={faBars} onClick={handleNavClick} className="md:hidden text-white" aria-label="Menu" />
      <nav
        className={`flex ${
          isNavShown ? "show" : "hidden"
        } absolute headerImg headerMenu imgCover bg-black inset-x-0 top-16 p-20 justify-center md:flex md:static md:p-0`}
      >
        <ul className="flex flex-col text-white text-center gap-10 md:flex-row">
          <li>
            <Link to="/" onClick={handleHideMenus}>
              Home
            </Link>
          </li>
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/login" onClick={handleHideMenus}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/registration" onClick={handleHideMenus}>
                  Registration
                </Link>
              </li>
            </>
          )}
          {isLoggedIn && (
            <>
              <li>
                <Link to="/profilePage" onClick={handleHideMenus}>
                  Profile
                </Link>
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
