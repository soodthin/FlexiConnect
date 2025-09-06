import { Facebook, Twitter, Linkedin, Instagram, Mail, Inspect } from "lucide-react";

export default function Footer() {
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

                {/* Quick Links */}
                <div>
                    <h4 className="font-semibold mb-4">Quick Links</h4>
                    <ul className="flex flex-col gap-2 text-gray-700 dark:text-gray-300">
                        <li><a href="/about" className="hover:underline">Về chúng tôi</a></li>
                        <li><a href="/jobs" className="hover:underline">Tìm việc</a></li>
                        <li><a href="/employers" className="hover:underline">Nhà tuyển dụng</a></li>
                        <li><a href="/contact" className="hover:underline">Liên hệ</a></li>
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

            <div className="border-t border-gray-200 dark:border-[#444] mt-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} FlexiConnect. All rights reserved.
            </div>
        </footer>
    );
}
