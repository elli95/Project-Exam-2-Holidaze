// import ProfileBookingVenuesInfo from "../ProfileBookingVenuesInfo";
import ProfileInfoEdit from "../ProfileInfoEdit";
// import CreateVenue from "../CreateVenue";
import useGETProfileData from "../../hooks/useGETProfileData";
import { useEffect, useRef, useState } from "react";
import useBtnDividerEventHandlers from "../../hooks/useBtnDividerEventHandlers";
import ProfileBooking from "../ProfileBooking";
import ProfileVenues from "../ProfileVenues";
// import useLocalStorage from "../../hooks/useLocalStorage";

function ProfileInfo() {
  const [profileData, setProfileData] = useState({});
  const [isUserManager, setIsUserManager] = useState();
  const { profileData: fetchedProfileData } = useGETProfileData();
  const [isProfileEditShown, setIsProfileEditShown] = useState(false);

  const divRef = useRef(null);

  useEffect(() => {
    setIsUserManager(fetchedProfileData.venueManager);
    setProfileData(fetchedProfileData);
  }, [fetchedProfileData]);
  console.log("profileData", profileData);

  useEffect(() => {
    if (localStorage.length === 0) {
      window.location.href = "/";
    }
  }, []);

  const handleSeeProfileBooking = () => {
    setIsProfileEditShown(true);
  };

  const handleClickOutside = (event) => {
    setTimeout(() => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsProfileEditShown(false);
      }
    }, 0);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const {
    isSectionAShown,
    isSectionBShown,
    isSectionAButtonDisabled,
    isSectionBButtonDisabled,
    setIsSectionAShown,
    setIsSectionBShown,
    setSectionAButtonDisabled,
    setSectionBButtonDisabled,
    handleSectionAClick,
    handleSectionBClick,
  } = useBtnDividerEventHandlers();

  const handleCloseBtn = () => {
    setIsProfileEditShown(false);
  };

  return (
    <div className="flex flex-col items-center">
      {!profileData.avatar ? (
        <div className="loading"></div>
      ) : (
        <>
          <div className="absolute left-0 z-0 w-full overflow-hidden self-center max-h-20 md:max-h-28 lg:max-h-32">
            {profileData.banner && <img src={profileData.banner.url} alt={profileData.banner.alt} className="object-contain" />}
          </div>
          <div className="relative z-10 my-2 h-40 w-40 overflow-hidden md:h-48 md:w-48 lg:h-60 lg:w-60">
            {profileData.avatar && <img src={profileData.avatar.url} alt={profileData.avatar.alt} className="rounded-full object-cover" />}
          </div>
          <div className="text-center pb-1.5">
            <h1 className="text-center font-bold">{profileData.name}</h1>
            <p className="italic">{profileData.email}</p>
          </div>
          {profileData.bio && (
            <div className="border-solid border-t-2 border-b-2 max-w-md shadow-lg shadow-black w-270 sm:w-375">
              <p className="my-2.5">{profileData.bio}</p>
            </div>
          )}

          <div className="flex flex-col justify-center gap-2.5 m-2.5">
            <div className="flex justify-center">
              <button className="btnStyle w-44" onClick={handleSeeProfileBooking}>
                Edit Profile
              </button>
            </div>
            {isProfileEditShown && (
              <div className="overlay">
                <div ref={divRef} className="modulePosition w-box340 h-5/6 rounded-lg border-2 border-greyBlur sm:w-box610 lg:w-box900">
                  <ProfileInfoEdit
                    setIsUserManager={setIsUserManager}
                    setIsProfileEditShown={setIsProfileEditShown}
                    setProfileData={setProfileData}
                    setIsSectionAShown={setIsSectionAShown}
                    setIsSectionBShown={setIsSectionBShown}
                    setSectionAButtonDisabled={setSectionAButtonDisabled}
                    setSectionBButtonDisabled={setSectionBButtonDisabled}
                    handleCloseBtn={handleCloseBtn}
                  />
                </div>
              </div>
            )}
          </div>

          {isUserManager && (
            <div className="max-w-3xl flex justify-center">
              <button
                className={`${isSectionBButtonDisabled ? "bg-tahiti" : "bg-bermuda"} px-5 py-2 w-40 h-16 text-wrap rounded-l-lg border-2 sm:w-60`}
                onClick={handleSectionAClick}
                disabled={isSectionAButtonDisabled}
              >
                My Bookings
              </button>
              <button
                className={`${isSectionAButtonDisabled ? "bg-tahiti" : "bg-bermuda"} px-5 py-2 w-40 h-16 text-wrap rounded-r-lg border-2 sm:w-60`}
                onClick={handleSectionBClick}
                disabled={isSectionBButtonDisabled}
              >
                My Venues
              </button>
            </div>
          )}
          <div>
            {isSectionAShown && <ProfileBooking />}
            {isSectionBShown && <ProfileVenues />}
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileInfo;
