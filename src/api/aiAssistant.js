const MOCK_DELAY = 700;

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const generateId = (prefix) => {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${randomPart}`;
};

const toTitle = (content) => {
  if (!content) return "Phiên trò chuyện mới";
  if (content.length <= 38) return content;
  return `${content.slice(0, 35)}...`;
};

export const MOCK_AI_RECOMMENDED_COURSES = [
  {
    id: 101,
    title: "TypeScript thực chiến cho React Developer",
    instructor: "Linh Trần",
    category: "Công nghệ thông tin",
    level: "Trung cấp",
    price: 499000,
    rating: 4.9,
    students: 6520,
    reviewCount: 1882,
    color: "from-indigo-500 to-blue-500",
    reason: "Bạn đang học React, TypeScript sẽ giúp code an toàn kiểu dữ liệu và dễ bảo trì hơn.",
    score: 99,
  },
  {
    id: 102,
    title: "Testing React với Vitest và Testing Library",
    instructor: "Quang Vũ",
    category: "Công nghệ thông tin",
    level: "Trung cấp",
    price: 429000,
    rating: 4.8,
    students: 4310,
    reviewCount: 972,
    color: "from-slate-600 to-slate-800",
    reason: "Gợi ý dựa trên lịch sử học Frontend, phù hợp để nâng chất lượng sản phẩm trước khi deploy.",
    score: 98,
  },
  {
    id: 103,
    title: "Kiến trúc Frontend hiện đại cho dự án lớn",
    instructor: "Nam Hoàng",
    category: "Công nghệ thông tin",
    level: "Nâng cao",
    price: 699000,
    rating: 4.9,
    students: 2780,
    reviewCount: 641,
    color: "from-cyan-500 to-sky-600",
    reason: "Bạn đã có nền tảng React, khóa này giúp tối ưu cấu trúc codebase và scale team.",
    score: 96,
  },
  {
    id: 104,
    title: "Node.js REST API cho Frontend Fullstack",
    instructor: "Huy Nguyễn",
    category: "Công nghệ thông tin",
    level: "Trung cấp",
    price: 469000,
    rating: 4.8,
    students: 5930,
    reviewCount: 1324,
    color: "from-emerald-500 to-teal-500",
    reason: "Dựa vào hành vi học tập, bạn phù hợp mở rộng sang backend để hoàn thiện fullstack.",
    score: 95,
  },
  {
    id: 105,
    title: "UI Motion cho Web với Framer Motion",
    instructor: "Hà Lê",
    category: "Thiết kế đồ họa",
    level: "Cơ bản",
    price: 329000,
    rating: 4.7,
    students: 3820,
    reviewCount: 844,
    color: "from-purple-500 to-pink-500",
    reason: "Khóa học này giúp giao diện bạn thiết kế mượt và thu hút hơn mà vẫn giữ hiệu năng tốt.",
    score: 94,
  },
  {
    id: 106,
    title: "Design System từ Figma tới React",
    instructor: "Thu Hà",
    category: "Thiết kế đồ họa",
    level: "Trung cấp",
    price: 389000,
    rating: 4.8,
    students: 5120,
    reviewCount: 1108,
    color: "from-fuchsia-500 to-rose-500",
    reason: "Gợi ý theo lộ trình cá nhân hóa để bạn kết nối tốt giữa team design và team dev.",
    score: 92,
  },
  {
    id: 107,
    title: "Docker cho lập trình viên Web",
    instructor: "Phúc Trịnh",
    category: "Công nghệ thông tin",
    level: "Cơ bản",
    price: 359000,
    rating: 4.8,
    students: 4740,
    reviewCount: 1012,
    color: "from-blue-500 to-cyan-500",
    reason: "Dựa trên mục tiêu nghề nghiệp, Docker là bước cần thiết để triển khai môi trường nhất quán.",
    score: 91,
  },
  {
    id: 108,
    title: "GraphQL căn bản đến nâng cao",
    instructor: "Đức Lê",
    category: "Công nghệ thông tin",
    level: "Nâng cao",
    price: 519000,
    rating: 4.7,
    students: 2890,
    reviewCount: 633,
    color: "from-violet-500 to-indigo-600",
    reason: "Bạn đã học nhiều về API REST, GraphQL là bước mở rộng giúp truy vấn dữ liệu linh hoạt hơn.",
    score: 90,
  },
  {
    id: 109,
    title: "Clean Code JavaScript toàn diện",
    instructor: "Bảo Khanh",
    category: "Công nghệ thông tin",
    level: "Trung cấp",
    price: 449000,
    rating: 4.8,
    students: 7910,
    reviewCount: 1601,
    color: "from-lime-500 to-green-500",
    reason: "Khóa này cải thiện tư duy viết code sạch, đặc biệt hữu ích khi làm việc team hoặc dự án dài hạn.",
    score: 89,
  },
  {
    id: 110,
    title: "Tối ưu hiệu năng ứng dụng React",
    instructor: "Minh Hoàng",
    category: "Công nghệ thông tin",
    level: "Nâng cao",
    price: 559000,
    rating: 4.9,
    students: 3680,
    reviewCount: 887,
    color: "from-amber-500 to-orange-500",
    reason: "Hệ thống đề xuất nhận thấy bạn sắp hoàn thiện lộ trình React, bước này giúp tăng độ chuyên sâu.",
    score: 88,
  },
];

export const createChatMessage = ({ role, content }) => ({
  id: generateId("msg"),
  role,
  content,
  createdAt: new Date().toISOString(),
});

export const createDefaultChatSession = (context = {}) => {
  const lessonTitle = context.lessonTitle;
  const courseTitle = context.courseTitle;

  let welcomeText = "Xin chào, mình là AI Assistant. Bạn muốn mình hỗ trợ gì trong buổi học hôm nay?";

  if (lessonTitle && courseTitle) {
    welcomeText = `Xin chào, mình sẵn sàng hỗ trợ bạn trong bài ${lessonTitle} của khóa ${courseTitle}.`;
  } else if (courseTitle) {
    welcomeText = `Xin chào, mình sẵn sàng hỗ trợ bạn trong khóa ${courseTitle}.`;
  }

  return {
    id: generateId("session"),
    title: "Phiên trò chuyện mới",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    context,
    messages: [
      {
        id: generateId("msg"),
        role: "assistant",
        content: welcomeText,
        createdAt: new Date().toISOString(),
      },
    ],
  };
};

export const createSessionTitleFromFirstQuestion = (question) => toTitle(question);

export const getAIPromptSuggestions = (context = {}) => {
  const prompts = [
    "Tóm tắt nội dung bài học này theo 5 ý chính.",
    "Cho mình 3 câu hỏi quiz để tự kiểm tra ngay.",
    "Giải thích khái niệm này theo ví dụ đời thường.",
    "Gợi ý checklist để áp dụng vào dự án thực tế.",
  ];

  if (context.lessonTitle) {
    prompts.unshift(`Mình cần note nhanh cho bài ${context.lessonTitle}.`);
  }

  if (context.courseTitle) {
    prompts.unshift(`Lên lộ trình 2 tuần cho khóa ${context.courseTitle}.`);
  }

  return prompts.slice(0, 6);
};

export const getAIRecommendedCoursesMock = async ({ limit = 10 } = {}) => {
  await wait(500);

  // TODO(API): Sau này thay bằng call API thật từ server.
  // Ví dụ:
  // const response = await axios.get(`${import.meta.env.VITE_API_URL}/ai/recommendations`, {
  //   params: { limit },
  //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  // });
  // return response.data.data;

  return MOCK_AI_RECOMMENDED_COURSES.slice(0, limit);
};

const buildContextHint = (context = {}) => {
  const parts = [];

  if (context.courseTitle) parts.push(`khóa học ${context.courseTitle}`);
  if (context.sectionTitle) parts.push(`chương ${context.sectionTitle}`);
  if (context.lessonTitle) parts.push(`bài ${context.lessonTitle}`);

  if (!parts.length) return "nội dung bạn đang học";
  return parts.join(" - ");
};

export const sendChatToAIMock = async ({ message, context = {}, history = [] }) => {
  await wait(MOCK_DELAY);

  // TODO(API): Sau này thay bằng call API stream/chat thật từ server.
  // Ví dụ:
  // const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/chat`, {
  //   message,
  //   context,
  //   history,
  // });
  // return {
  //   reply: response.data.data.reply,
  //   suggestions: response.data.data.suggestions,
  // };

  const contextHint = buildContextHint(context);
  const historyHint = history.length
    ? `Mình đã tham chiếu ${history.length} tin nhắn gần nhất trong phiên.`
    : "Phiên này đang bắt đầu nên mình sẽ trả lời theo hướng tổng quan trước.";

  const reply = [
    `Mình đã nhận câu hỏi: "${message}".`,
    historyHint,
    `Ngữ cảnh hiện tại: ${contextHint}.`,
    "Gợi ý xử lý: xác định mục tiêu bài học, chia nhỏ thành từng bước, và kiểm tra bằng ví dụ cụ thể.",
    "Nếu bạn muốn, mình có thể đưa luôn đoạn code mẫu ngắn theo đúng bài đang học.",
  ].join("\n");

  return {
    reply,
    suggestions: getAIPromptSuggestions(context),
  };
};
