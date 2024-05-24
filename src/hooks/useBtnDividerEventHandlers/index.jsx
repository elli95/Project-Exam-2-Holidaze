import { useState } from "react";

function useBtnDividerEventHandlers() {
  const [isSectionAShown, setIsSectionAShown] = useState(true);
  const [isSectionBShown, setIsSectionBShown] = useState(false);
  const [isSectionAButtonDisabled, setSectionAButtonDisabled] = useState(true);
  const [isSectionBButtonDisabled, setSectionBButtonDisabled] = useState(false);
  // setIsTravelersShown
  // setIsVenueManagersShown
  const handleSectionAClick = () => {
    setIsSectionAShown(!isSectionAShown);
    setIsSectionBShown(!isSectionBShown);
    setSectionAButtonDisabled(true);
    setSectionBButtonDisabled(false);
  };

  const handleSectionBClick = () => {
    setIsSectionBShown(!isSectionBShown);
    setIsSectionAShown(!isSectionAShown);
    setSectionAButtonDisabled(false);
    setSectionBButtonDisabled(true);
  };

  return {
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
  };
}

export default useBtnDividerEventHandlers;
