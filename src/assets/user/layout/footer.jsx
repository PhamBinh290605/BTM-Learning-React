import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    platform: [
      { label: "Trang chủ", path: "/" },
      { label: "Khóa học", path: "/courses" },
      { label: "Giảng viên", path: "/about" },
      { label: "Đăng ký giảng dạy", path: "/auth/register" },
    ],
    support: [
      { label: "Trung tâm hỗ trợ", path: "#" },
      { label: "Câu hỏi thường gặp", path: "#" },
      { label: "Chính sách bảo mật", path: "#" },
      { label: "Điều khoản sử dụng", path: "#" },
    ],
    categories: [
      { label: "Công nghệ thông tin", path: "/courses" },
      { label: "Thiết kế", path: "/courses" },
      { label: "Marketing", path: "/courses" },
      { label: "Ngoại ngữ", path: "/courses" },
    ],
  };

  return (
    <footer className="bg-slate-900 dark:bg-[#0a0f1e] text-slate-300 border-t border-slate-800 dark:border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                </svg>
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-tight">
                Edu<span className="text-amber-400">Bright</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              Nền tảng học trực tuyến hàng đầu Việt Nam. Kết nối học viên với
              giảng viên uy tín, cung cấp khóa học chất lượng cao.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                {
                  name: "Facebook",
                  icon: (
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  ),
                },
                {
                  name: "YouTube",
                  icon: (
                    <>
                      <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" />
                      <path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" />
                    </>
                  ),
                },
                {
                  name: "LinkedIn",
                  icon: (
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z" />
                  ),
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                  aria-label={social.name}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Nền tảng
            </h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Danh mục
            </h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Hỗ trợ
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-white font-semibold text-sm mb-3">
                Nhận thông báo mới
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 bg-white/5 border border-white/10 rounded-l-xl px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-r-xl text-sm font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all">
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            © 2026 BTMLearning. BTM Learning Platform. Mọi quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Chính sách
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Điều khoản
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Cookie
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
