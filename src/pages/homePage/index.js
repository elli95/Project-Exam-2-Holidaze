import HomepagePostLogin from "../../components/HomepagePostLogin";
import HomepagePreLogin from "../../components/HomepagePreLogin";
import useLocalStorage from "../../hooks/useLocalStorage";

function HomePage() {
  const { accessToken } = useLocalStorage();
  const isLoggedIn = accessToken.length > 0;

  console.log("123123123@stud.noroff.no", accessToken);

  return (
    <div>
      {!isLoggedIn && <HomepagePreLogin />}
      {isLoggedIn && <HomepagePostLogin />}
    </div>
  );
}

export default HomePage;
