type CloseButtonProps = {
  handleClose: () => void;
};

export const CloseButton: React.FC<CloseButtonProps> = ({ handleClose }) => {
  return (
    <button
      type="button"
      onClick={handleClose}
      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
    >
      Отмена
    </button>
  );
};
