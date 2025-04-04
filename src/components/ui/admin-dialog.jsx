 const AdminDialog = ({
  title,
  onClose,
  onSubmit,
  submitBtnLabel,
  children,
}) => {
  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      id="my-modal"
    >
      <div className="relative top-12 mx-auto  border w-full max-w-xl shadow-lg rounded-md bg-white">
        <div className="px-4 py-3 border-b-2">
          <h3 className="text-lg font-semibold  ">{title}</h3>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex-col "
        >
          <div className="max-h-[70vh] overflow-y-auto  p-4">
           
            {children}
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {submitBtnLabel}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDialog;