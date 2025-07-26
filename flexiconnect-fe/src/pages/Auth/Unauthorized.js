export default function Unauthorized() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-red-600">403 - Không có quyền truy cập</h1>
      <p className="mt-4">Bạn không đủ quyền để xem trang này.</p>
    </div>
  );
}
