/**
 * ConfirmationModal component displays a modal for confirmation with a message and action buttons.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.message - The message to display in the modal.
 * @param {Function} props.onConfirm - Function to be called when the "Yes" button is clicked.
 * @param {Function} props.onCancel - Function to be called when the "No" button is clicked.
 * @returns {JSX.Element} The JSX element representing the confirmation modal.
 */
export function ConfirmationModal({ message, onConfirm, onCancel, containerClassName, contentClassName, buttonClassName }) {
  return (
    <div className={containerClassName}>
      <div className={contentClassName}>
        <div className="flex flex-col justify-center">
          <p className="text-xl text-center">{message}</p>
          <div className="flex gap-5 justify-evenly pt-5">
            <button className={`btnStyle confirmBtn w-24 ${buttonClassName.confirm}`} onClick={onConfirm}>
              Yes
            </button>
            <button className={`btnStyle denyBtn w-24 ${buttonClassName.deny}`} onClick={onCancel}>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
