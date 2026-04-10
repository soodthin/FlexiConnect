import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "@contexts/MyContexts";
import { cn } from "@/utils/cn";

export default function Footer() {
    const user = useContext(MyUserContext);
    const navigate = useNavigate();

    // Links theo role
    const roleLinks = {
        CANDIDATE: [
            { label: "Tìm việc", onClick: () => navigate("/") },
            { label: "Hồ sơ của tôi", onClick: () => navigate("/candidate-profile") },
            { label: "Về chúng tôi", onClick: () => navigate("/about") },
            { label: "Liên hệ", onClick: () => navigate("/contact") },


        ],
        EMPLOYER: [
            { label: "Đăng tuyển dụng", onClick: () => navigate("/employer-job-posts") },
            { label: "Ứng viên đã ứng tuyển", onClick: () => navigate("/employer-applications-management") },
        ],
        ADMIN: [
            { label: "Duyệt nhà tuyển dụng", onClick: () => navigate("/admin-pending-employers") },
            { label: "Quản lý người dùng", onClick: () => navigate("/admin-users-management") },
            { label: "Quản lý tin tuyển dụng", onClick: () => navigate("/admin-jobposts-management") },
        ],
        GUEST: [
            { label: "Về chúng tôi", onClick: () => navigate("/about") },
            { label: "Tìm việc", onClick: () => navigate("/jobs") },
            { label: "Liên hệ", onClick: () => navigate("/contact") },
        ]
    };

    const links = roleLinks[user?.role] || roleLinks["GUEST"];

    return (
        <footer className={cn(
            "bg-beige-200 dark:bg-dark-bg-secondary",
            "text-softblack dark:text-dark-text-primary",
            "border-t border-neutral-200 dark:border-dark-border-subtle"
        )}>
            <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
                {/* Logo */}
                <div className="flex flex-col gap-3">
                    <span className={cn(
                        "w-12 h-12 rounded-xl shadow-soft",
                        "bg-offblack dark:bg-beige-200",
                        "flex items-center justify-center font-bold text-2xl",
                        "text-white dark:text-softblack"
                    )}>
                        FL
                    </span>
                    <span className="font-bold text-xl tracking-tight">FlexiConnect</span>
                    <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">
                        Kết nối nhà tuyển dụng và ứng viên một cách nhanh chóng, tiện lợi và hiệu quả.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className="font-semibold mb-4 text-softblack dark:text-dark-text-primary">Quick Links</h4>
                    <ul className="flex flex-col gap-2 text-neutral-700 dark:text-dark-text-secondary">
                        {links.map((link, index) => (
                            <li key={`${link.label}-${index}`}>
                                <button onClick={link.onClick} className="hover:text-beige-700 dark:hover:text-beige-400 transition-colors hover:underline underline-offset-2 text-left">{link.label}</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h4 className="font-semibold mb-4 text-softblack dark:text-dark-text-primary">Mạng xã hội</h4>
                    <div className="flex gap-4">
                        <a href="#" aria-label="Facebook" className="text-neutral-600 dark:text-dark-text-secondary hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Facebook className="w-6 h-6" aria-hidden="true" />
                        </a>
                        <a href="https://www.instagram.com/_soodthin/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-neutral-600 dark:text-dark-text-secondary hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                            <Instagram className="w-6 h-6" aria-hidden="true" />
                        </a>
                        <a href="#" aria-label="LinkedIn" className="text-neutral-600 dark:text-dark-text-secondary hover:text-blue-700 dark:hover:text-blue-500 transition-colors">
                            <Linkedin className="w-6 h-6" aria-hidden="true" />
                        </a>
                        <a href="mailto:flexiconnect.mail@gmail.com" aria-label="Email us" className="text-neutral-600 dark:text-dark-text-secondary hover:text-red-500 dark:hover:text-red-400 transition-colors">
                            <Mail className="w-6 h-6" aria-hidden="true" />
                        </a>
                    </div>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-semibold mb-4 text-softblack dark:text-dark-text-primary">Liên hệ</h4>
                    <p className="text-neutral-700 dark:text-dark-text-secondary text-sm">Email: flexiconnect.mail@gmail.com</p>
                    <p className="text-neutral-700 dark:text-dark-text-secondary text-sm mt-1">Điện thoại: +84 123 456 789</p>
                    <p className="text-neutral-700 dark:text-dark-text-secondary text-sm mt-1">Địa chỉ: TP. HCM, Việt Nam</p>
                </div>
            </div>

            <div className="border-t border-neutral-200 dark:border-dark-border-subtle py-4 text-center text-sm text-neutral-500 dark:text-dark-text-tertiary">
                &copy; {new Date().getFullYear()} FlexiConnect. All rights reserved.
            </div>
        </footer>
    );
}
