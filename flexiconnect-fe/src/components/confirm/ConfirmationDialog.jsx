import { X, AlertTriangle } from 'lucide-react';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      {/* Hộp thoại */}
      <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-[#2a2a2a] border dark:border-gray-700">
        <div className="flex items-start">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-4 text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100" id="modal-title">
                    {title}
                </h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                    {message}
                    </p>
                </div>
            </div>
        </div>

        {/* Các nút hành động */}
        <div className="mt-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
          >
            Xác nhận
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 dark:ring-0 sm:mt-0 sm:w-auto"
          >
            Hủy
          </button>
        </div>

         {/* Nút đóng tuyệt đối */}
         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={20}/>
        </button>
      </div>
    </div>
  );
};

export default ConfirmationDialog;