import { Link } from "react-router-dom";
import useBtnDividerEventHandlers from "../../hooks/useBtnDividerEventHandlers";

function HomepagePreLogin() {
  const { isSectionAShown, isSectionBShown, isSectionAButtonDisabled, isSectionBButtonDisabled, handleSectionAClick, handleSectionBClick } =
    useBtnDividerEventHandlers();

  //console.log(isSectionAShown, isSectionBShown);

  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold border-t-2 pt-5 w-80 sm:w-96">Your Gateway to Adventure</h2>
        <p className="text-lg pt-2.5 max-w-box510">
          At Holidaze, we believe that every journey begins with a single step. Whether you’re an intrepid explorer seeking hidden gems or a wanderer
          in search of relaxation, we’ve got you covered.
        </p>
      </div>
      <div>
        <div className="flex flex-col items-center text-center py-3">
          <h2 className="text-xl font-semibold p-2.5">Become a member</h2>
          <div className="max-w-3xl flex md:hidden">
            <button
              className={`${
                isSectionBButtonDisabled ? "bg-tahiti" : "bg-bermuda"
              } flex items-center justify-center text-lg px-5 py-2 w-1/2 h-16 text-wrap rounded-l-lg border-2 sm:w-60`}
              onClick={handleSectionAClick}
              disabled={isSectionAButtonDisabled}
            >
              For Travelers
            </button>
            <button
              className={`${
                isSectionAButtonDisabled ? "bg-tahiti" : "bg-bermuda"
              } flex items-center justify-center text-lg px-5 py-2 w-1/2 h-16 text-wrap rounded-r-lg border-2 sm:w-60`}
              onClick={handleSectionBClick}
              disabled={isSectionBButtonDisabled}
            >
              For Venue Managers
            </button>
          </div>
          <div className="max-w-3xl hidden md:flex">
            <h2 className="flex items-center justify-center text-lg bg-bermuda px-5 py-2 w-1/2 h-16 text-wrap rounded-l-lg border-2 content-center sm:w-60">
              For Travelers
            </h2>
            <h2 className="flex items-center justify-center text-lg bg-bermuda px-5 py-2 w-1/2 h-16 text-wrap rounded-r-lg border-2 content-center sm:w-60">
              For Venue Managers
            </h2>
          </div>
        </div>
        <div className="flex justify-center">
          <div className={`${isSectionAShown ? "flex" : "hidden"} flex-1 flex-col max-w-2xl md:px-3 md:flex md:border-r-2 xl:px-12`}>
            <p className="text-center text-lg">
              At Holidaze, we’re thrilled to have you join our community of intrepid travelers! As a member, you’ll unlock a world of possibilities:
            </p>
            <ul className="flex flex-col text-lg m-2.5 gap-2.5">
              <li className="bg-greyBlur px-1">
                <b>Explore:</b> Dive into our curated collection of exotic destinations. From pristine beaches to bustling cities, there’s something
                for every type of traveler.
              </li>
              <li className="px-1">
                <b>Book:</b> Secure your dream vacation with ease. Choose from a variety of flights, hotels, and tours. Our user-friendly platform
                makes booking a breeze.
              </li>
              <li className="bg-greyBlur px-1">
                <b>Discover:</b> Unearth local secrets and immerse yourself in vibrant cultures. Sample authentic cuisine, explore historical
                landmarks, and create memories that last a lifetime.
              </li>
              <li className="px-1">
                <b>Connect:</b> Join a global community of fellow wanderers. Share travel tips, swap stories, and find inspiration for your next
                adventure.
              </li>
            </ul>
          </div>
          <div className={`${isSectionBShown ? "flex" : "hidden"} flex-1 flex-col max-w-2xl md:px-3 md:flex md:border-l-2 xl:px-12`}>
            <p className="text-center text-lg">
              Are you passionate about a specific travel destination? Become a Destination Manager and make your mark:
            </p>
            <ul className="flex flex-col text-lg m-2.5 gap-2.5">
              <li className="bg-greyBlur px-1">
                <b>Showcase:</b> Share your insider knowledge! Post captivating travel experiences, hidden gems, and off-the-beaten-path
                recommendations.
              </li>
              <li className="px-1">
                <b>Engage:</b> Connect with fellow travelers. Answer questions, provide tips, and foster a sense of camaraderie.
              </li>
              <li className="bg-greyBlur px-1">
                <b>Earn:</b> Receive commissions for every booking made through your recommendations. Your expertise is valuable, and we want to
                reward you for it.
              </li>
              <li className="px-1">
                <b>Inspire:</b> Be a source of inspiration for others. Your love for travel can ignite wanderlust in fellow adventurers.
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center text-center pt-2.5">
          <h2 className="text-xl">Ready to Embark on Your Journey?</h2>
          <Link to="/registration">
            <button className="btnStyle alternativeBtnStyle text-lg my-5">Sign up now!</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomepagePreLogin;
