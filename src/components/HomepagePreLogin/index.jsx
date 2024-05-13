import { Link } from "react-router-dom";
import Venues from "../Venues";
import useBtnDividerEventHandlers from "../../hooks/useBtnDividerEventHandlers";

function HomepagePreLogin() {
  const {
    isTravelersShown,
    isVenueManagersShown,
    isTravelersButtonDisabled,
    isVenueManagersButtonDisabled,
    handleTravelersClick,
    handleVenueManagersClick,
  } = useBtnDividerEventHandlers();

  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <h1 className="border-b-2 w-80 sm:w-96">Welcome to Holidaze!</h1>
        <h2>Your Gateway to Adventure</h2>
        <p>
          At Holidaze, we believe that every journey begins with a single step. Whether you’re an intrepid explorer seeking hidden gems or a wanderer
          in search of relaxation, we’ve got you covered.
        </p>
      </div>
      <div>
        <div className="flex flex-col items-center text-center py-3">
          <h2>Become a member</h2>
          <div className="max-w-3xl flex md:hidden">
            <button
              className={`${isVenueManagersButtonDisabled ? "bg-tahiti" : "bg-bermuda"} px-5 py-2 w-1/2 h-16 text-wrap rounded-l-lg border-2 sm:w-60`}
              onClick={handleTravelersClick}
              disabled={isTravelersButtonDisabled}
            >
              For Travelers
            </button>
            <button
              className={`${isTravelersButtonDisabled ? "bg-tahiti" : "bg-bermuda"} px-5 py-2 w-1/2 h-16 text-wrap rounded-r-lg border-2 sm:w-60`}
              onClick={handleVenueManagersClick}
              disabled={isVenueManagersButtonDisabled}
            >
              For Venue Managers
            </button>
          </div>
          <div className="max-w-3xl hidden md:flex">
            <h2 className="bg-bermuda px-5 py-2 w-1/2 h-16 text-wrap rounded-l-lg border-2 content-center sm:w-60">For Travelers</h2>
            <h2 className="bg-bermuda px-5 py-2 w-1/2 h-16 text-wrap rounded-r-lg border-2 content-center sm:w-60">For Venue Managers</h2>
          </div>
        </div>
        <div className="flex justify-center">
          <div className={`${isTravelersShown ? "hidden" : "flex"} flex-1 flex-col max-w-2xl md:px-3 md:flex md:border-r-2 xl:px-12`}>
            <p className="text-center">
              At Holidaze, we’re thrilled to have you join our community of intrepid travelers! As a member, you’ll unlock a world of possibilities:
            </p>
            <ol className="flex flex-col list-decimal m-2.5 gap-2.5">
              <li>
                <b>Explore:</b> Dive into our curated collection of exotic destinations. From pristine beaches to bustling cities, there’s something
                for every type of traveler.
              </li>
              <li>
                <b>Book:</b> Secure your dream vacation with ease. Choose from a variety of flights, hotels, and tours. Our user-friendly platform
                makes booking a breeze.
              </li>
              <li>
                <b>Discover:</b> Unearth local secrets and immerse yourself in vibrant cultures. Sample authentic cuisine, explore historical
                landmarks, and create memories that last a lifetime.
              </li>
              <li>
                <b>Connect:</b> Join a global community of fellow wanderers. Share travel tips, swap stories, and find inspiration for your next
                adventure.
              </li>
            </ol>
          </div>
          <div className={`${isVenueManagersShown ? "flex" : "hidden"} flex-1 flex-col max-w-2xl md:px-3 md:flex md:border-l-2 xl:px-12`}>
            <p className="text-center">Are you passionate about a specific travel destination? Become a Destination Manager and make your mark:</p>
            <ol className="flex flex-col list-decimal m-2.5 gap-2.5">
              <li>
                <b>Showcase:</b> Share your insider knowledge! Post captivating travel experiences, hidden gems, and off-the-beaten-path
                recommendations.
              </li>
              <li>
                <b>Engage:</b> Connect with fellow travelers. Answer questions, provide tips, and foster a sense of camaraderie.
              </li>
              <li>
                <b>Earn:</b> Receive commissions for every booking made through your recommendations. Your expertise is valuable, and we want to
                reward you for it.
              </li>
              <li>
                <b>Inspire:</b> Be a source of inspiration for others. Your love for travel can ignite wanderlust in fellow adventurers.
              </li>
            </ol>
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <h2>Ready to Embark on Your Journey?</h2>
          <Link to="/registration">
            <button>Sign up now!</button>
          </Link>
        </div>
        <div className="flex flex-col">
          <h2>Popular venues:</h2>
          <Venues />
        </div>
      </div>
    </div>
  );
}

export default HomepagePreLogin;
