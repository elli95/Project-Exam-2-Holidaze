import HomepagePreLogin from "../../components/HomepagePreLogin";
import Venues from "../../components/Venues";
import useLocalStorage from "../../hooks/useLocalStorage";

function HomePage() {
  const { accessToken } = useLocalStorage();
  const isLoggedIn = accessToken.length > 0;

  return (
    <div className="mainDiv imgCover flex-col">
      <div className="homeImg self-center">
        <div className="m-5 bg-grayShadeHover rounded homePageInfoCard p-1.5">
          <h1 className="flex justify-center text-center text-3xl md:text-4xl lg:text-5xl pt-10 pb-5 font-semibold">
            Start your journey with Holidaze
          </h1>
          {!isLoggedIn && <HomepagePreLogin />}
          {/* {isLoggedIn && <HomepagePostLogin />} */}
        </div>
      </div>
      <div className="self-center">
        <Venues />
      </div>
    </div>
  );
}

export default HomePage;
