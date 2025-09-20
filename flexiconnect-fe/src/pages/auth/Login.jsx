import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Apis, { endpoints } from "@configs/APIs";
import { toast } from "sonner";
import { unstable_PasswordToggleField as PasswordToggleField } from "radix-ui";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { MyDispatcherContext } from "@contexts/MyContexts";

// UI components
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-[#232323] shadow-2xl border border-gray-200 dark:border-neutral-700 rounded-2xl p-8 ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2.5 rounded-xl font-semibold shadow hover:opacity-90 transition ${className}`}
  >
    {children}
  </button>
);

const Input = ({ type = "text", value, onChange, placeholder, ...props }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400"
    {...props}
  />
);

const Label = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    {children}
  </label>
);

const InputWrapper = ({ children }) => (
  <div className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-neutral-600 bg-gray-50 dark:bg-[#2d2d2d] px-3 h-11 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400 transition">
    {children}
  </div>
);

// Fake job data
const jobs = [
  { title: "Frontend Developer", company: "VNG", salary: "20–30 triệu VND" },
  { title: "Khoa học dữ liệu", company: "Fintech", salary: "25–35 triệu VND" },
  { title: "UI/UX Designer", company: "Creatify", salary: "18–25 triệu VND" },
  { title: "QA/QC", company: "Dcorp", salary: "15-23 triệu VND" },
  { title: "Quản lý cửa hàng", company: "Highlands Coffee", salary: "10-12 triệu VND" },
];

export default function Login() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const dispatch = useContext(MyDispatcherContext);

  const setState = (value, field) => setUser({ ...user, [field]: value });

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await Apis.post(endpoints["login"], {
        email: user.email,
        password: user.password,
      });
      const { token, role } = res.data;
      const currentUserRes = await Apis.get(endpoints["current-user"], {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = { ...currentUserRes.data, token, role };
      dispatch({ type: "login", payload: userData });
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);

      toast.success("Đăng nhập thành công!");

      setTimeout(() => {
        if (role === "CANDIDATE") navigate("/candidate-dashboard");
        else if (role === "EMPLOYER") navigate("/employer-dashboard");
        else if (role === "ADMIN") navigate("/admin-dashboard");
        else navigate("/");
      }, 800);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) toast.error(err.response.data);
        else if (err.response.status === 403) toast.error("Sai email hoặc mật khẩu!");
        else toast.error(err.response.data || "Có lỗi xảy ra, vui lòng thử lại sau!");
      } else {
        toast.error("Không thể kết nối đến server!");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1c1c] dark:to-[#111]">
      {/* Left panel with AI features + auto-scroll jobs */}
      <div className="hidden md:flex flex-[0.45] flex-col justify-center items-center p-10 relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-200 to-gray-50 dark:from-[#1e1e1e] dark:via-[#2a2a2a] dark:to-[#181818] rounded-r-3xl">
        <div className="relative z-10 w-full max-w-sm space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Khám phá cơ hội mới
            </h2>
          </div>

          {/* AI Features */}
          <div className="grid gap-3">
            {/* Feature 1 */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 
                  border border-blue-400/20 dark:border-purple-400/20 
                  shadow-lg backdrop-blur-md group hover:shadow-blue-500/30 transition transform hover:-translate-y-1">

              {/* Premium badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-400 to-purple-400 
                    text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow">
                BASIC
              </div>

              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                Gợi ý viết hồ sơ với AI
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition">
                AI giúp tối ưu CV, làm nổi bật kỹ năng và kinh nghiệm quan trọng để chinh phục nhà tuyển dụng.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 
                  border border-purple-400/20 dark:border-pink-400/20 
                  shadow-lg backdrop-blur-md group hover:shadow-purple-500/30 transition transform hover:-translate-y-1">

              {/* Premium badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 
                    text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow">
                PREMIUM
              </div>

              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></span>
                Luyện tập phỏng vấn ảo với AI
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition">
                Trải nghiệm phỏng vấn mô phỏng với AI, luyện tập câu trả lời và tăng sự tự tin.
              </p>
            </div>
          </div>




          {/* Job list auto-scroll */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Việc làm mới nhất
            </h3>

            <div className="h-56 overflow-hidden relative">
              <div className="animate-scroll space-y-3">
                {[...jobs, ...jobs].map((job, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-gradient-to-r from-gray-50/70 to-white/60 
                     dark:from-[#2a2a2a]/80 dark:to-[#232323]/70
                     border border-gray-200/40 dark:border-neutral-700/40
                     shadow-sm backdrop-blur-md hover:shadow-md hover:scale-[1.02] transition"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                      {job.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 truncate">
                      {job.company} • {job.salary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>



      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <form onSubmit={login} className="w-full max-w-md relative">
          <Card>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                FlexiConnect AI
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Đăng nhập để tiếp tục
              </p>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label>Email</Label>
              <InputWrapper>
                <Input
                  type="email"
                  placeholder="Nhập email..."
                  value={user.email || ""}
                  onChange={(e) => setState(e.target.value, "email")}
                  required
                />
              </InputWrapper>
            </div>

            {/* Password */}
            <div className="space-y-1 mt-4">
              <Label>Mật khẩu</Label>
              <PasswordToggleField.Root>
                <InputWrapper>
                  <PasswordToggleField.Input
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400"
                    placeholder="Nhập mật khẩu..."
                    value={user.password || ""}
                    onChange={(e) => setState(e.target.value, "password")}
                    required
                  />
                  <PasswordToggleField.Toggle className="outline-none text-gray-500">
                    <PasswordToggleField.Icon
                      visible={<EyeOpenIcon />}
                      hidden={<EyeClosedIcon />}
                    />
                  </PasswordToggleField.Toggle>
                </InputWrapper>
              </PasswordToggleField.Root>
            </div>

            {/* Submit */}
            <div className="mt-6">
              <Button type="submit">Đăng nhập</Button>
            </div>

            {/* Register link */}
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-gray-900 dark:text-gray-100 font-semibold hover:underline transition"
              >
                Đăng ký ngay
              </button>
            </p>


          </Card>
        </form>
      </div>

      {/* Scroll animation CSS */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll {
          display: flex;
          flex-direction: column;
          animation: scroll 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
