import { useState } from "react";

/**
 * Custom hook to manage event handlers and state for button divider sections.
 * @returns {{
 *  isSectionAShown: boolean,
 *  isSectionBShown: boolean,
 *  isSectionAButtonDisabled: boolean,
 *  isSectionBButtonDisabled: boolean,
 *  setIsSectionAShown: Function,
 *  setIsSectionBShown: Function,
 *  setSectionAButtonDisabled: Function,
 *  setSectionBButtonDisabled: Function,
 *  handleSectionAClick: Function,
 *  handleSectionBClick: Function
 * }} An object containing state variables and event handlers for button divider sections.
 */
function useBtnDividerEventHandlers() {
  const [isSectionAShown, setIsSectionAShown] = useState(true);
  const [isSectionBShown, setIsSectionBShown] = useState(false);
  const [isSectionAButtonDisabled, setSectionAButtonDisabled] = useState(true);
  const [isSectionBButtonDisabled, setSectionBButtonDisabled] = useState(false);

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
