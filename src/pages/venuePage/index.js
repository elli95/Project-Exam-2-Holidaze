import VenueInfo from "../../components/VenueInfo";

/**
 * VenuePage Component
 * Renders the page for displaying detailed information about a venue.
 * @returns {JSX.Element} VenuePage component
 */
function VenuePage() {
  return (
    <div className="mainDiv imgCover py-10 mt-10 lg:mt-0">
      <VenueInfo />
    </div>
  );
}

export default VenuePage;
