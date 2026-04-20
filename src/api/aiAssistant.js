import axiosClient from "./axiosClient";
import { getAccessToken } from "../utils/session";

const generateId = (prefix) => {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${randomPart}`;
};

const toTitle = (content) => {
  if (!content) return "Phiên trò chuyện mới";
  if (content.length <= 38) return content;
  return `${content.slice(0, 35)}...`;
};

const RECOMMENDATION_COLORS = [
  "from-indigo-500 to-blue-500",
  "from-slate-600 to-slate-800",
  "from-cyan-500 to-sky-600",
  "from-emerald-500 to-teal-500",
  "from-purple-500 to-pink-500",
  "from-fuchsia-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-indigo-600",
  "from-lime-500 to-green-500",
  "from-amber-500 to-orange-500",
];

const parseApiResult = (response) => response?.data?.result;

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toReason = (course, source = "ai") => {
  const description = course?.description?.trim();
  if (!description) {
    if (source === "catalog") {
      return "Gợi ý từ các khóa học nổi bật được nhiều học viên quan tâm gần đây.";
    }

    return "Gợi ý dựa trên lịch sử học và mức độ quan tâm các chủ đề gần đây của bạn.";
  }

  if (description.length <= 120) {
    return description;
  }

  return `${description.slice(0, 117)}...`;
};

const toRecommendationScore = (rating) => {
  const normalized = Math.round(78 + toNumber(rating) * 4.5);
  return Math.max(75, Math.min(99, normalized));
};

const mapRecommendationCourse = (course, index, source = "ai") => ({
  id: course.id,
  slug: course.slug,
  thumbnailUrl: course.thumbnailUrl,
  title: course.title || "Khóa học chưa đặt tên",
  instructor: course?.instructor?.fullName || course?.instructorName || "BTM Learning",
  category: course?.category?.name || "Khóa học đề xuất",
  level: course.level || "Mọi trình độ",
  price: toNumber(course.price),
  rating: toNumber(course.avgRating),
  students: toNumber(course.totalStudents),
  reviewCount: toNumber(course.reviewCount, toNumber(course.totalStudents)),
  color: RECOMMENDATION_COLORS[index % RECOMMENDATION_COLORS.length],
  reason: toReason(course, source),
  score: toRecommendationScore(course.avgRating),
  source,
});

const getPopularCourseFallback = async ({ limit = 10 } = {}) => {
  const response = await axiosClient.get("/courses");
  const result = parseApiResult(response);

  if (!Array.isArray(result)) {
    return [];
  }

  return [...result]
    .sort((firstCourse, secondCourse) => {
      const secondPriority = toNumber(secondCourse.totalStudents) * 2 + toNumber(secondCourse.avgRating);
      const firstPriority = toNumber(firstCourse.totalStudents) * 2 + toNumber(firstCourse.avgRating);
      return secondPriority - firstPriority;
    })
    .slice(0, limit)
    .map((course, index) => mapRecommendationCourse(course, index, "catalog"));
};

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
    sessionToken: null,
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

export const createAiChatSession = async ({ courseId } = {}) => {
  const normalizedCourseId = Number(courseId);
  const payload = Number.isFinite(normalizedCourseId)
    ? { courseId: normalizedCourseId }
    : {};

  const response = await axiosClient.post("/ai/chat/sessions", payload);
  const session = parseApiResult(response);

  if (!session?.sessionToken) {
    throw new Error("Không tạo được phiên chat AI.");
  }

  return session;
};

export const sendChatToAI = async ({ sessionToken, message }) => {
  const normalizedMessage = message?.trim();
  if (!normalizedMessage) {
    throw new Error("Nội dung câu hỏi không hợp lệ.");
  }

  if (!sessionToken) {
    throw new Error("Phiên chat không hợp lệ.");
  }

  const response = await axiosClient.post(
    `/ai/chat/sessions/${encodeURIComponent(sessionToken)}/messages`,
    { content: normalizedMessage },
  );

  const result = parseApiResult(response);
  const reply = result?.content?.trim();

  if (!reply) {
    throw new Error("AI chưa trả về nội dung phản hồi.");
  }

  return {
    role: result?.role || "assistant",
    reply,
    createdAt: result?.createdAt || new Date().toISOString(),
  };
};

export const getAIRecommendedCourses = async ({ limit = 10 } = {}) => {
  const hasAccessToken = Boolean(getAccessToken());

  if (!hasAccessToken) {
    return getPopularCourseFallback({ limit });
  }

  try {
    const response = await axiosClient.get("/ai/chat/recommend");
    const result = parseApiResult(response);

    if (Array.isArray(result) && result.length) {
      return result.slice(0, limit).map((course, index) => mapRecommendationCourse(course, index, "ai"));
    }

    return getPopularCourseFallback({ limit });
  } catch {
    return getPopularCourseFallback({ limit });
  }
};
