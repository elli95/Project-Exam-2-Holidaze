// import HomepagePostLogin from "../../components/HomepagePostLogin";
import HomepagePreLogin from "../../components/HomepagePreLogin";
import Venues from "../../components/Venues";
import useLocalStorage from "../../hooks/useLocalStorage";

function HomePage() {
  const { accessToken } = useLocalStorage();
  const isLoggedIn = accessToken.length > 0;

  return (
    <div>
      <h1 className="flex justify-center text-center text-3xl md:text-4xl lg:text-5xl p-10">Start your journey with Holidaze</h1>

      {!isLoggedIn && <HomepagePreLogin />}
      {/* {isLoggedIn && <HomepagePostLogin />} */}
      <Venues />
    </div>
  );
}

export default HomePage;
