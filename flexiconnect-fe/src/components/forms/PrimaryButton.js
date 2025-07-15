const InputField = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-600 font-semibold">{label}</label>
    <input
      className="w-full px-4 py-3 mt-1 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
      {...props}
    />
  </div>
);
export default InputField;
