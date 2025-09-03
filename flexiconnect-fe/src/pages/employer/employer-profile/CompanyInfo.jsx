import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Pencil, X } from "lucide-react";
import { authApis, endpoints } from "@configs/APIs";
import { toast } from "sonner";

/* ---------------------- 🧩 UI PRIMITIVES ---------------------- */
const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-[#232323] rounded-xl shadow p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg font-semibold transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const IconButton = ({ children, className = "", ...props }) => (
  <button
    className={`p-2 rounded-lg border flex items-center gap-1 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Dialog = {
  Root: DialogPrimitive.Root,
  Trigger: DialogPrimitive.Trigger,
  Portal: DialogPrimitive.Portal,
  Overlay: (props) => (
    <DialogPrimitive.Overlay
      className="fixed inset-0 bg-black/40 z-40"
      {...props}
    />
  ),
  Content: ({ children, className = "", ...props }) => (
    <DialogPrimitive.Content
      className={`fixed left-1/2 top-1/2 max-h-[95vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-[#1e1e1e] p-8 shadow-xl border border-neutral-200 dark:border-neutral-700 z-50 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  ),
  Title: DialogPrimitive.Title,
  Close: DialogPrimitive.Close,
};

/* ---------------------- 🧩 FEATURE COMPONENT ---------------------- */
export default function CompanyInfo({ profile, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    taxCode: "",
    companyAddress: "",
    website: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const handleOpenChange = (val) => {
    setOpen(val);
    if (val) {
      setForm({
        phoneNumber: profile.phoneNumber || "",
        companyName: profile.companyName || "",
        taxCode: profile.taxCode || "",
        companyAddress: profile.companyAddress || "",
        website: profile.website || "",
      });
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApis().put(endpoints["employer-profile"], {
        ...profile,
        ...form,
      });
      toast.success("✅ Cập nhật thông tin công ty thành công!");
      setOpen(false);

      const res = await authApis().get(endpoints["employer-profile"]);
      if (onUpdated) onUpdated(res.data);
    } catch {
      toast.error("❌ Có lỗi xảy ra khi cập nhật thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full text-[16px] leading-relaxed">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          🏢 Thông tin công ty
        </h3>
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
          <Dialog.Trigger asChild>
            <IconButton className="bg-neutral-100 dark:bg-neutral-700 hover:bg-yellow-200 dark:hover:bg-yellow-600 text-black dark:text-white">
              <Pencil size={16} /> Chỉnh sửa
            </IconButton>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content>
              <Dialog.Title className="text-2xl font-bold mb-2 text-black dark:text-white">
                Chỉnh sửa thông tin công ty
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="space-y-5">
                {["phoneNumber", "companyName", "taxCode", "companyAddress", "website"].map(
                  (field) => (
                    <input
                      key={field}
                      name={field}
                      placeholder={
                        field === "phoneNumber"
                          ? "Số điện thoại"
                          : field === "companyName"
                          ? "Tên công ty"
                          : field === "taxCode"
                          ? "Mã số thuế"
                          : field === "companyAddress"
                          ? "Địa chỉ công ty"
                          : "Website"
                      }
                      value={form[field]}
                      onChange={handleChange}
                      className="w-full rounded-lg border px-4 py-2 bg-white dark:bg-neutral-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                      required={field === "companyName"}
                    />
                  )
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-neutral-900 dark:bg-yellow-500 text-white"
                    disabled={loading}
                  >
                    Lưu
                  </Button>
                  <Dialog.Close asChild>
                    <Button
                      type="button"
                      className="flex-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white"
                    >
                      Huỷ
                    </Button>
                  </Dialog.Close>
                </div>
              </form>
              <Dialog.Close asChild>
                <IconButton className="absolute right-4 top-4 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-black dark:text-white rounded-full">
                  <X size={18} />
                </IconButton>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
        <div>
          <strong>Email:</strong> {profile.email || "Chưa cập nhật"}
        </div>
        <div>
          <strong>Điện thoại:</strong> {profile.phoneNumber || "Chưa cập nhật"}
        </div>
        <div>
          <strong>Tên công ty:</strong> {profile.companyName || "Chưa cập nhật"}
        </div>
        <div>
          <strong>Mã số thuế:</strong> {profile.taxCode || "Chưa cập nhật"}
        </div>
        <div>
          <strong>Website:</strong>{" "}
          {profile.website ? (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              {profile.website}
            </a>
          ) : (
            "Chưa cập nhật"
          )}
        </div>
        <div className="sm:col-span-2">
          <strong>Địa chỉ:</strong> {profile.companyAddress || "Chưa cập nhật"}
        </div>
      </div>
    </Card>
  );
}
