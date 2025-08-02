import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, Pencil2Icon, TrashIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { authApis, endpoints } from "@configs/APIs";

function extractImagesFromIntro(introHtml) {
  const div = document.createElement("div");
  div.innerHTML = introHtml;
  const images = [...div.querySelectorAll(".company-gallery img")].map(img => img.src);
  div.querySelector(".company-gallery")?.remove();
  return {
    text: div.innerHTML.trim(),
    images,
  };
}

export default function CompanyIntro({ profile, onUpdated }) {
  const [open, setOpen] = useState(false);
  const { text, images: initialImages } = extractImagesFromIntro(profile.companyIntro || "");
  const [introText, setIntroText] = useState(text);
  const [images, setImages] = useState(initialImages);
  const [loading, setLoading] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "FlexiConnect");
    const res = await fetch("https://api.cloudinary.com/v1_1/dxhp3sukx/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setImages((prev) => [...prev, data.secure_url]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let html = `<p>${introText}</p>`;
      if (images.length > 0) {
        html += `<div class='company-gallery'>${images
          .map((url) => `<img src='${url}' alt='company image' />`)
          .join("")}</div>`;
      }

      await authApis().put(endpoints["employer-profile"], {
        ...profile,
        companyIntro: html,
      });
      setOpen(false);
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#232323] rounded-xl shadow p-6 text-[16px] leading-relaxed">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-black dark:text-white">📝 Giới thiệu công ty</h3>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-yellow-200 dark:hover:bg-yellow-600 border flex items-center gap-1 text-black dark:text-white">
              <Pencil2Icon /> Chỉnh sửa
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[95vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-[#1e1e1e] p-8 shadow-xl border border-neutral-200 dark:border-neutral-700 z-50 focus:outline-none overflow-y-auto">
              <Dialog.Title className="text-2xl font-bold mb-2 text-black dark:text-white">Chỉnh sửa giới thiệu công ty</Dialog.Title>
              <form onSubmit={handleSubmit} className="space-y-6">
                <textarea
                  className="w-full h-32 p-3 border rounded-md dark:bg-neutral-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
                  value={introText}
                  onChange={(e) => setIntroText(e.target.value)}
                  placeholder="Mô tả công ty..."
                />

                <div>
                  <p className="font-semibold mb-2 text-black dark:text-white">📸 Thư viện ảnh</p>
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((url, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={url}
                          alt="company"
                          className="w-full h-32 object-cover rounded-md border cursor-zoom-in"
                          onClick={() => setZoomedImage(url)}
                        />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    ))}
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                        className="hidden"
                      />
                      <PlusCircledIcon className="w-6 h-6 text-gray-500" />
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="flex-1 bg-black dark:bg-yellow-500 text-white py-2 rounded-md font-medium">
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                  <Dialog.Close asChild>
                    <button type="button" className="flex-1 bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white py-2 rounded-md font-medium">Huỷ</button>
                  </Dialog.Close>
                </div>
              </form>
              <Dialog.Close asChild>
                <button className="absolute right-4 top-4 text-black dark:text-white">
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="prose dark:prose-invert text-sm max-w-none mb-4">
        <p dangerouslySetInnerHTML={{ __html: introText }} />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Ảnh ${i + 1}`}
              className="w-full h-32 object-cover rounded-md cursor-zoom-in"
              onClick={() => setZoomedImage(url)}
            />
          ))}
        </div>
      )}

      {/* Zoom image dialog */}
      <Dialog.Root open={!!zoomedImage} onOpenChange={(open) => !open && setZoomedImage(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-4xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 p-4 z-50">
            <img src={zoomedImage || ""} alt="Zoomed" className="w-full h-auto rounded-lg object-contain max-h-[80vh] mx-auto" />
            <Dialog.Close asChild>
              <button className="absolute top-4 right-4 text-white bg-black/60 p-2 rounded-full hover:bg-black">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
