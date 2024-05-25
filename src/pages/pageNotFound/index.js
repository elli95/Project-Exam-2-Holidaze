import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="mainDiv flex items-center">
      <div className="bg-grayShadeHover flex flex-col justify-center items-center text-center max-w-box400 h-fit p-10 rounded gap-2.5">
        <h1>Oops! 🙈</h1>
        <h2>We're sorry, but the page you're looking for could not be found. It might have been moved, renamed, or it may no longer exist.</h2>
        <h2>Here are some helpful links to get you back on track:</h2>
        {/* <ul>
          <li> */}
        <Link to={`/`}>
          <h2 className="btnStyle alternativeBtnStyle text-lg my-5 w-52">Home</h2>
        </Link>
        {/* </li>
          <li>Contact Us</li>
          <li>Our Services</li>
          <li>FAQ</li>
        </ul>
        <h2>If you're still having trouble finding what you need, please contact our support team and we'll be happy to assist you.</h2>
        <h2>Thank you for your understanding!</h2>
        <h2>Best,</h2>
        <h2>The Holidaze Team</h2> */}
      </div>
    </div>
  );
}

export default PageNotFound;
