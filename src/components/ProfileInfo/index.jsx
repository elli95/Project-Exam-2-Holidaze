import ProfileBookingVenuesInfo from "../ProfileBookingVenuesInfo";
import ProfileInfoEdit from "../ProfileInfoEdit";
import CreateVenue from "../CreateVenue";
import useGETProfileData from "../../hooks/useGETProfileData";
import { useEffect, useState } from "react";

function ProfileInfo() {
  const [profileData, setProfileData] = useState({});
  const { profileData: fetchedProfileData } = useGETProfileData();

  useEffect(() => {
    setProfileData(fetchedProfileData);
  }, [fetchedProfileData]);
  console.log("profileData", profileData);
  return (
    <div className="flex flex-col items-center">
      {!profileData.name ? (
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
          <div className="border-solid border-t-2 border-b-2 max-w-md shadow-lg shadow-black w-270 sm:w-375">
            <p className="my-2.5">{profileData.bio}</p>{" "}
          </div>

          <div className="flex flex-col justify-center gap-2.5 m-2.5">
            <ProfileInfoEdit setProfileData={setProfileData} />
            <CreateVenue />
            <ProfileBookingVenuesInfo />
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileInfo;
