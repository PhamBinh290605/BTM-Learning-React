import { useNavigate } from "react-router-dom";

const values = [
  {
    title: "Chất lượng thực tiễn",
    description: "Nội dung được xây dựng từ nhu cầu công việc thực tế và cập nhật liên tục theo thị trường.",
    icon: "01",
  },
  {
    title: "Lấy người học làm trung tâm",
    description: "Mỗi khóa học đều tối ưu trải nghiệm học từ cơ bản đến nâng cao để ai cũng có thể theo kịp.",
    icon: "02",
  },
  {
    title: "Cộng đồng cùng phát triển",
    description: "Kết nối học viên, giảng viên và doanh nghiệp để tạo ra hành trình học bền vững.",
    icon: "03",
  },
];

const stats = [
  { label: "Khóa học", value: "12K+" },
  { label: "Học viên", value: "500K+" },
  { label: "Giảng viên", value: "1.2K+" },
  { label: "Tỷ lệ hài lòng", value: "98%" },
];

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 h-72 w-72 rounded-full bg-violet-200/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl text-center text-white">
          <p className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
            Về BTM Learning
          </p>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Chúng tôi xây dựng nền tảng học tập để mọi người phát triển sự nghiệp bền vững
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm text-white/80 sm:text-base">
            BTM Learning hướng đến việc rút ngắn khoảng cách giữa kiến thức và công việc thực tế thông qua các
            khóa học chất lượng, lộ trình rõ ràng và trải nghiệm học tập hiện đại.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate("/courses")}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-slate-100"
            >
              Khám phá khóa học
            </button>
            <button
              onClick={() => navigate("/auth/register")}
              className="rounded-xl border border-white/25 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Bắt đầu học ngay
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-center shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{item.value}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-slate-900/60 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sứ mệnh và giá trị cốt lõi</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Chúng tôi tin rằng việc học hiệu quả phải đi cùng tính ứng dụng cao và khả năng đồng hành lâu dài.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60"
              >
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                  {value.icon}
                </div>
                <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{value.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
