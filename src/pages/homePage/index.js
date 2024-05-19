import HomepagePostLogin from "../../components/HomepagePostLogin";
import HomepagePreLogin from "../../components/HomepagePreLogin";
import useLocalStorage from "../../hooks/useLocalStorage";

function HomePage() {
  const { accessToken } = useLocalStorage();
  const isLoggedIn = accessToken.length > 0;

  return (
    <div>
      {!isLoggedIn && <HomepagePreLogin />}
      {isLoggedIn && <HomepagePostLogin />}
    </div>
  );
}

export default HomePage;
