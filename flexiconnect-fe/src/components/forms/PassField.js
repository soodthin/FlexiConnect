import { useState } from "react";
import { Eye, EyeSlash } from "react-bootstrap-icons";

export default function PasswordField({ label, value, onChange, required = false }) {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-gray-600 mb-1 text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-2 pr-10 rounded-xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          type="button"
          className="absolute top-2.5 right-3 text-gray-500"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeSlash /> : <Eye />}
        </button>
      </div>
    </div>
  );
}
