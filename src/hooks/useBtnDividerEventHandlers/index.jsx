import { useState } from "react";

function useBtnDividerEventHandlers() {
  const [isTravelersShown, setIsTravelersShown] = useState(false);
  const [isVenueManagersShown, setIsVenueManagersShown] = useState(false);
  const [isTravelersButtonDisabled, setTravelersButtonDisabled] = useState(true);
  const [isVenueManagersButtonDisabled, setVenueManagersButtonDisabled] = useState(false);

  const handleTravelersClick = () => {
    setIsTravelersShown(!isTravelersShown);
    setIsVenueManagersShown(!isVenueManagersShown);
    setTravelersButtonDisabled(true);
    setVenueManagersButtonDisabled(false);
  };

  const handleVenueManagersClick = () => {
    setIsVenueManagersShown(!isVenueManagersShown);
    setIsTravelersShown(!isTravelersShown);
    setTravelersButtonDisabled(false);
    setVenueManagersButtonDisabled(true);
  };

  return {
    isTravelersShown,
    isVenueManagersShown,
    isTravelersButtonDisabled,
    isVenueManagersButtonDisabled,
    handleTravelersClick,
    handleVenueManagersClick,
  };
}

export default useBtnDividerEventHandlers;
