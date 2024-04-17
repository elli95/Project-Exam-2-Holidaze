import { Link } from "react-router-dom";
import Venues from "../../components/Venues";

function HomePage() {
  return (
    <div>
      <div>
        <h1>Welcome to Holidaze!</h1>
        <h2>Your Gateway to Adventure</h2>
        <p>
          At Holidaze, we believe that every journey begins with a single step. Whether you’re an intrepid explorer seeking hidden gems or a wanderer
          in search of relaxation, we’ve got you covered.
        </p>
      </div>
      <div>
        <h2>Become a member</h2>
        <button>For Travelers</button>
        <button>For Venue Managers</button>
        <div>
          <p>
            At Holidaze, we’re thrilled to have you join our community of intrepid travelers! As a member, you’ll unlock a world of possibilities:
          </p>
          <ol>
            <li>
              Explore: Dive into our curated collection of exotic destinations. From pristine beaches to bustling cities, there’s something for every
              type of traveler.
            </li>
            <li>
              Book: Secure your dream vacation with ease. Choose from a variety of flights, hotels, and tours. Our user-friendly platform makes
              booking a breeze.
            </li>
            <li>
              Discover: Unearth local secrets and immerse yourself in vibrant cultures. Sample authentic cuisine, explore historical landmarks, and
              create memories that last a lifetime.
            </li>
            <li>
              Connect: Join a global community of fellow wanderers. Share travel tips, swap stories, and find inspiration for your next adventure.
            </li>
          </ol>
        </div>
        <div>
          <p>Are you passionate about a specific travel destination? Become a Destination Manager and make your mark:</p>
          <ol>
            <li>
              Showcase: Share your insider knowledge! Post captivating travel experiences, hidden gems, and off-the-beaten-path recommendations.
            </li>
            <li>Engage: Connect with fellow travelers. Answer questions, provide tips, and foster a sense of camaraderie.</li>
            <li>
              Earn: Receive commissions for every booking made through your recommendations. Your expertise is valuable, and we want to reward you for
              it.
            </li>
            <li>Inspire: Be a source of inspiration for others. Your love for travel can ignite wanderlust in fellow adventurers.</li>
          </ol>
        </div>
        <h2>Ready to Embark on Your Journey?</h2>
        <Link to="/registration">
          <button>Sign up now!</button>
        </Link>
      </div>
      <div>
        <h2>Popular venues:</h2>
        <Venues />
      </div>
    </div>
  );
}

export default HomePage;
