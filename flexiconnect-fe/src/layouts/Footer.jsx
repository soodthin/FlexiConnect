import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";
import { useContext } from "react";
import { MyUserContext } from "@contexts/MyContexts";

export default function Footer() {
    const user = useContext(MyUserContext);

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
        <footer className="bg-gray-100 dark:bg-[#111111] text-gray-800 dark:text-[#f5efe6] font-inter">
            <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
                {/* Logo */}
                <div className="flex flex-col gap-3">
                    <span className="w-12 h-12 rounded-xl shadow bg-[#111111] flex items-center justify-center font-bold text-white text-2xl">
                        FL
                    </span>
                    <span className="font-bold text-xl tracking-tight">FlexiConnect</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Kết nối nhà tuyển dụng và ứng viên một cách nhanh chóng, tiện lợi và hiệu quả.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className="font-semibold mb-4">Quick Links</h4>
                    <ul className="flex flex-col gap-2 text-gray-700 dark:text-gray-300">
                        {links.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} className="hover:underline">{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Mạng xã hội</h4>
                    <div className="flex gap-4">
                        <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a href="https://www.instagram.com/_soodthin/" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors">
                            <Linkedin className="w-6 h-6" />
                        </a>
                        <a href="mailto:flexiconnect.mail@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                            <Mail className="w-6 h-6" />
                        </a>
                    </div>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-semibold mb-4">Liên hệ</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Email: flexiconnect.mail@gmail.com</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">Điện thoại: +84 123 456 789</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">Địa chỉ: TP. HCM, Việt Nam</p>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-[#444] py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} FlexiConnect. All rights reserved.
            </div>
        </footer>
    );
}
