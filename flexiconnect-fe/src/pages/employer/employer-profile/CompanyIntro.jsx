import { useState } from "react";
import {
  X,
  Pencil,
  Trash2,
  PlusCircle,
} from "lucide-react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { authApis, endpoints } from "@configs/APIs";

/* -------------------- UI Primitives -------------------- */
function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl shadow bg-white dark:bg-[#232323] ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, variant = "default", className = "", ...props }) {
  const base =
    "px-3 py-2 rounded-md font-medium flex items-center gap-1 transition";
  const variants = {
    default:
      "bg-black dark:bg-yellow-500 text-white hover:opacity-90 disabled:opacity-70",
    secondary:
      "bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white hover:opacity-80",
    ghost:
      "bg-neutral-100 dark:bg-neutral-700 text-black dark:text-white hover:bg-yellow-200 dark:hover:bg-yellow-600",
    icon: "p-2 rounded-full bg-black/60 text-white hover:bg-black",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Dialog({ open, onOpenChange, title, children }) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <RadixDialog.Content className="fixed left-1/2 top-1/2 max-h-[95vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-[#1e1e1e] p-8 shadow-xl border border-neutral-200 dark:border-neutral-700 z-50 focus:outline-none overflow-y-auto">
          {title && (
            <RadixDialog.Title className="text-2xl font-bold mb-4 text-black dark:text-white">
              {title}
            </RadixDialog.Title>
          )}
          {children}
          <RadixDialog.Close asChild>
            <button className="absolute right-4 top-4 text-black dark:text-white">
              <X />
            </button>
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full h-32 p-3 border rounded-md dark:bg-neutral-800 text-black dark:text-white border-gray-300 dark:border-gray-600 ${className}`}
      {...props}
    />
  );
}

function ImageGrid({ images, onRemove, onZoom, onAdd }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {images.map((url, i) => (
        <div key={i} className="relative group">
          <img
            src={url}
            alt="company"
            className="w-full h-32 object-cover rounded-md border cursor-zoom-in"
            onClick={() => onZoom(url)}
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files[0] && onAdd(e.target.files[0])}
          className="hidden"
        />
        <PlusCircle className="w-6 h-6 text-gray-500" />
      </label>
    </div>
  );
}

/* -------------------- Helper -------------------- */
function extractImagesFromIntro(introHtml) {
  const div = document.createElement("div");
  div.innerHTML = introHtml;
  const images = [...div.querySelectorAll(".company-gallery img")].map(
    (img) => img.src
  );
  div.querySelector(".company-gallery")?.remove();
  return {
    text: div.innerHTML.trim(),
    images,
  };
}

/* -------------------- Feature Component -------------------- */
export default function CompanyIntro({ profile, onUpdated }) {
  const [open, setOpen] = useState(false);
  const { text, images: initialImages } = extractImagesFromIntro(
    profile.companyIntro || ""
  );
  const [introText, setIntroText] = useState(text);
  const [images, setImages] = useState(initialImages);
  const [loading, setLoading] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "FlexiConnect");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dxhp3sukx/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
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
    <Card className="w-full p-6 text-[16px] leading-relaxed">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          📝 Giới thiệu công ty
        </h3>
        <RadixDialog.Root open={open} onOpenChange={setOpen}>
          <RadixDialog.Trigger asChild>
            <Button variant="ghost">
              <Pencil size={16} /> Chỉnh sửa
            </Button>
          </RadixDialog.Trigger>
          <Dialog open={open} onOpenChange={setOpen} title="Chỉnh sửa giới thiệu công ty">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Textarea
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                placeholder="Mô tả công ty..."
              />

              <div>
                <p className="font-semibold mb-2 text-black dark:text-white">
                  📸 Thư viện ảnh
                </p>
                <ImageGrid
                  images={images}
                  onRemove={(i) =>
                    setImages(images.filter((_, idx) => idx !== i))
                  }
                  onZoom={setZoomedImage}
                  onAdd={handleImageUpload}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
                <RadixDialog.Close asChild>
                  <Button type="button" variant="secondary" className="flex-1">
                    Huỷ
                  </Button>
                </RadixDialog.Close>
              </div>
            </form>
          </Dialog>
        </RadixDialog.Root>
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
      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <div className="relative">
          <img
            src={zoomedImage || ""}
            alt="Zoomed"
            className="w-full h-auto rounded-lg object-contain max-h-[80vh] mx-auto"
          />
          <RadixDialog.Close asChild>
            <Button variant="icon" className="absolute top-4 right-4">
              <X />
            </Button>
          </RadixDialog.Close>
        </div>
      </Dialog>
    </Card>
  );
}
