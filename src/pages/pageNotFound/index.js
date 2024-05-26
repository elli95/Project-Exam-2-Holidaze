import { Link } from "react-router-dom";

/**
 * PageNotFound component renders a message indicating that the requested page could not be found.
 * It provides a link to redirect users back to the home page.
 * @returns {JSX.Element} JSX element representing the PageNotFound component
 */
function PageNotFound() {
  return (
    <div className="mainDiv flex items-center">
      <div className="bg-grayShadeHover flex flex-col justify-center items-center text-center max-w-box400 h-fit p-10 rounded gap-2.5 text-xl">
        <h1>Oops! 🙈</h1>
        <h2>We're sorry, but the page you're looking for could not be found. It might have been moved, renamed, or it may no longer exist.</h2>
        <h2>Let us help you get back on track:</h2>
        <Link to={`/`}>
          <h2 className="btnStyle alternativeBtnStyle text-lg my-5 w-52">Home</h2>
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
