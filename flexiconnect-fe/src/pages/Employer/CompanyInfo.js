import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { authApis, endpoints } from "../../configs/APIs";

export default function CompanyInfo({ profile, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    companyName: profile.companyName || "",
    taxId: profile.taxId || "",
    companyAddress: profile.companyAddress || "",
    website: profile.website || "",
  });
  const [loading, setLoading] = useState(false);

  // Khi mở dialog, reset form từ profile
  const handleOpenChange = (val) => {
    setOpen(val);
    if (val) {
      setForm({
        companyName: profile.companyName || "",
        taxId: profile.taxId || "",
        companyAddress: profile.companyAddress || "",
        website: profile.website || "",
      });
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApis().put(endpoints["employer-profile"], {
        ...profile,
        ...form,
      });
      setOpen(false);
      if (onUpdated) onUpdated();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#232323] rounded-xl shadow p-6 text-[16px] leading-relaxed">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold">🏢 Thông tin công ty</h3>
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
          <Dialog.Trigger asChild>
            <button className="p-2 rounded-lg bg-neutral-100 hover:bg-yellow-200 border flex items-center gap-1">
              <Pencil2Icon /> Chỉnh sửa
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[95vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-8 shadow-xl border border-neutral-200 z-50 focus:outline-none">
              <Dialog.Title className="text-2xl font-bold mb-2">Chỉnh sửa thông tin công ty</Dialog.Title>
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  name="companyName"
                  placeholder="Tên công ty"
                  value={form.companyName}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2"
                  required
                />
                <input
                  name="taxId"
                  placeholder="Mã số thuế"
                  value={form.taxId}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2"
                />
                <input
                  name="companyAddress"
                  placeholder="Địa chỉ công ty"
                  value={form.companyAddress}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2"
                />
                <input
                  name="website"
                  placeholder="Website"
                  value={form.website}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-2"
                />
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="flex-1 bg-neutral-900 text-white py-2 rounded-lg font-semibold" disabled={loading}>
                    Lưu
                  </button>
                  <Dialog.Close asChild>
                    <button type="button" className="flex-1 bg-neutral-100 text-neutral-900 py-2 rounded-lg font-semibold">Huỷ</button>
                  </Dialog.Close>
                </div>
              </form>
              <Dialog.Close asChild>
                <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-neutral-200"><Cross2Icon /></button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <div className="flex flex-wrap gap-6 text-sm text-gray-700 dark:text-gray-300">
        <div><strong>Tên công ty:</strong> {profile.companyName}</div>
        <div><strong>Mã số thuế:</strong> {profile.taxId}</div>
        <div><strong>Địa chỉ công ty:</strong> {profile.companyAddress}</div>
        <div>
          <strong>Website:</strong>{" "}
          {profile.website ? (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {profile.website}
            </a>
          ) : "Chưa cập nhật"}
        </div>
      </div>
    </div>
  );
}