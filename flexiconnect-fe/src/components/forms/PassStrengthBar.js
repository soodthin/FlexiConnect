export default function PasswordStrengthBar({ strength }) {
  if (!strength.label) return null;

  return (
    <div className="mb-2">
      <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${strength.color}`}
          style={{ width: `${strength.percent}%` }}
        />
      </div>
      <div className="text-sm text-gray-500 mt-1">{`Mật khẩu: ${strength.label}`}</div>
    </div>
  );
}
