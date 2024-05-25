import { Link } from "react-router-dom";
import Venues from "../../components/Venues";

function HomePage() {
  return (
    <div className="mainDiv imgCover flex-col">
      <div className="self-center">
        <div className="m-5 bg-grayShadeHover rounded homePageInfoCard p-1.5 sm:py-5 sm:px-10">
          <h1 className="flex justify-center text-center text-3xl md:text-4xl lg:text-5xl pt-10 pb-5 font-semibold">
            Start your journey with Holidaze
          </h1>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold border-t-2 pt-5 w-80 sm:w-96">Your Gateway to Adventure</h2>
            <p className="text-lg pt-2.5 max-w-box510">
              At Holidaze, we believe that every journey begins with a single step. Whether you’re an intrepid explorer seeking hidden gems or a
              wanderer in search of relaxation, we’ve got you covered.
            </p>
          </div>
          <div>
            <div className="flex flex-col items-center text-center pt-2.5">
              <h2 className="text-xl">Ready to Embark on Your Journey?</h2>
              <Link to="/registration">
                <button className="btnStyle alternativeBtnStyle text-lg my-5 w-52">Sign up now!</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="self-center">
        <Venues />
      </div>
    </div>
  );
}

export default HomePage;
