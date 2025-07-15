const NotificationBox = ({ message }) => {
  const isSuccess = message.includes("✅");
  return (
    <div
      className={`p-3 rounded-md mb-4 text-sm font-medium text-center ${
        isSuccess
          ? "bg-beige text-gray-800 border border-green-300"
          : "bg-red-50 text-red-700 border border-red-200"
      }`}
    >
      {message}
    </div>
  );
};
export default NotificationBox;
