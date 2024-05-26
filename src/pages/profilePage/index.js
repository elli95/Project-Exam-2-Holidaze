import ProfileInfo from "../../components/ProfileInfo";

/**
 * ProfilePage component displays the user's profile information.
 * @component
 * @example
 * // Example usage of ProfilePage component:
 * import ProfilePage from './ProfilePage';
 * <ProfilePage />
 */
function ProfilePage() {
  return (
    <div className="mainDiv py-8 mt-10 lg:pt-0 lg:mt-0">
      <ProfileInfo />
    </div>
  );
}

export default ProfilePage;
