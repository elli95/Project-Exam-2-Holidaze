import ProfileBookingVenuesInfo from "../ProfileBookingVenuesInfo";
import ProfileInfoEdit from "../ProfileInfoEdit";
import CreateVenue from "../CreateVenue";
import useGETProfileData from "../../hooks/useGETProfileData";
import { useEffect, useState } from "react";

function ProfileInfo() {
  // const [profileData, setProfileData] = useState({});
  // const { profileData } = useGETProfileData();
  const [profileData, setProfileData] = useState({});
  const { profileData: fetchedProfileData } = useGETProfileData();

  useEffect(() => {
    setProfileData(fetchedProfileData);
  }, [fetchedProfileData]);

  return (
    <div className="flex flex-col items-center">
      <div className="absolute left-0 z-0 w-full overflow-hidden self-center max-h-32">
        {profileData.banner && <img src={profileData.banner.url} alt={profileData.banner.alt} className="object-contain" />}
      </div>
      <div className="relative z-10 h-60 w-60 overflow-hidden">
        {profileData.avatar && <img src={profileData.avatar.url} alt={profileData.avatar.alt} className="rounded-full object-cover" />}
      </div>
      <div>
        <h1>{profileData.name}</h1>
        <p>{profileData.email}</p>
      </div>
      <p>{profileData.bio}</p>

      <ProfileInfoEdit setProfileData={setProfileData} />
      {/* <ProfileInfoEdit /> */}
      <CreateVenue />
      <ProfileBookingVenuesInfo />
    </div>
  );
}

export default ProfileInfo;
