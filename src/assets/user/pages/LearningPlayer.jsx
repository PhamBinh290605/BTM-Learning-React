import { useState } from "react";

// import { getLessonById, markLessonComplete } from "../../../api/courses";

const LearningPlayer = () => {
  const [activeLesson, setActiveLesson] = useState(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState([0]);
  const [activeTab, setActiveTab] = useState("notes");
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);

  // ─── MOCK DATA ───
  const course = {
    title: "Lập trình ReactJS & Next.js Fullstack 2026",
    progress: 35,
    sections: [
      {
        title: "Giới thiệu & Cài đặt",
        lessons: [
          { id: 1, title: "Tổng quan khóa học", duration: "5:30", completed: true, type: "video" },
          { id: 2, title: "Cài đặt Node.js & VS Code", duration: "12:00", completed: true, type: "video" },
          { id: 3, title: "Tạo dự án React đầu tiên", duration: "15:00", completed: false, type: "video" },
        ],
      },
      {
        title: "React Fundamentals",
        lessons: [
          { id: 4, title: "JSX & Components", duration: "18:00", completed: false, type: "video" },
          { id: 5, title: "Props & State", duration: "22:00", completed: false, type: "video" },
          { id: 6, title: "Event Handling", duration: "14:00", completed: false, type: "video" },
          { id: 7, title: "Bài kiểm tra: React Basics", duration: "10 câu", completed: false, type: "quiz" },
        ],
      },
      {
        title: "React Hooks",
        lessons: [
          { id: 8, title: "useState Deep Dive", duration: "20:00", completed: false, type: "video" },
          { id: 9, title: "useEffect & Side Effects", duration: "25:00", completed: false, type: "video" },
          { id: 10, title: "useContext & Global State", duration: "18:00", completed: false, type: "video" },
          { id: 11, title: "Custom Hooks", duration: "22:00", completed: false, type: "video" },
        ],
      },
    ],
  };

  const allLessons = course.sections.flatMap((s) => s.lessons);
  const currentLesson = allLessons[activeLesson];
  const completedCount = allLessons.filter((l) => l.completed).length;

  const goToLesson = (globalIndex) => {
    setActiveLesson(globalIndex);
  };

  const goNext = () => {
    if (activeLesson < allLessons.length - 1) setActiveLesson(activeLesson + 1);
  };

  const goPrev = () => {
    if (activeLesson > 0) setActiveLesson(activeLesson - 1);
  };

  const toggleSection = (i) => {
    setExpandedSections((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    setNotes([
      ...notes,
      {
        text: noteText,
        timestamp: currentLesson.title,
        date: new Date().toLocaleDateString("vi-VN"),
      },
    ]);
    setNoteText("");
  };

  let globalIndex = 0;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Video Player Area */}
        <div className="relative bg-black aspect-video w-full flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-violet-900/30" />
          <div className="relative text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center cursor-pointer hover:bg-white/20 hover:scale-110 transition-all border border-white/20">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-white/60 text-sm">Video Player</p>
            <p className="text-white/40 text-xs mt-1">
              {currentLesson?.title}
            </p>
          </div>
          {/* Progress bar at video bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div className="h-full bg-indigo-500 rounded-r" style={{ width: "35%" }} />
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-slate-900 border-t border-white/5 px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={activeLesson === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Bài trước
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-white">
              {currentLesson?.title}
            </p>
            <p className="text-xs text-slate-500">
              Bài {activeLesson + 1} / {allLessons.length}
            </p>
          </div>
          <button
            onClick={goNext}
            disabled={activeLesson === allLessons.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Bài tiếp
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Bottom Tabs */}
        <div className="bg-slate-900 flex-1">
          <div className="flex gap-1 px-4 sm:px-6 pt-4 border-b border-white/5">
            {[
              { id: "notes", label: "Ghi chú" },
              { id: "qa", label: "Hỏi đáp" },
              { id: "resources", label: "Tài liệu" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="px-4 sm:px-6 py-6">
            {activeTab === "notes" && (
              <div>
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addNote()}
                    placeholder="Thêm ghi chú tại đây..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    onClick={addNote}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Lưu
                  </button>
                </div>
                {notes.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-8">
                    Chưa có ghi chú nào. Hãy ghi lại những điều quan trọng!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {notes.map((note, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <p className="text-sm text-slate-300">{note.text}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {note.timestamp} • {note.date}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "qa" && (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm">
                  Phần hỏi đáp sẽ được cập nhật sớm.
                </p>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="space-y-3">
                {[
                  { name: "Source Code - Bài 1", size: "2.4 MB", type: "ZIP" },
                  { name: "Slide bài giảng", size: "5.1 MB", type: "PDF" },
                  { name: "Cheat sheet React Hooks", size: "340 KB", type: "PDF" },
                ].map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                        {file.type}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{file.name}</p>
                        <p className="text-xs text-slate-500">{file.size}</p>
                      </div>
                    </div>
                    <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                      Tải xuống
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Course Content */}
      <aside className="w-full lg:w-80 bg-slate-900 border-l border-white/5 flex-shrink-0 lg:h-screen lg:sticky lg:top-0 overflow-y-auto">
        <div className="p-4 border-b border-white/5">
          <h3 className="font-bold text-white text-sm mb-3">{course.title}</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
                style={{ width: `${(completedCount / allLessons.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {completedCount}/{allLessons.length}
            </span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {course.sections.map((section, si) => {
            const sectionStart = globalIndex;
            return (
              <div key={si}>
                <button
                  onClick={() => toggleSection(si)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <svg
                      className={`w-3.5 h-3.5 text-slate-500 flex-shrink-0 transition-transform ${expandedSections.includes(si) ? "rotate-90" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-sm font-semibold text-slate-300 truncate">
                      {section.title}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                    {section.lessons.filter((l) => l.completed).length}/{section.lessons.length}
                  </span>
                </button>
                {expandedSections.includes(si) && (
                  <div>
                    {section.lessons.map((lesson, li) => {
                      const thisIndex = sectionStart + li;
                      const isActive = thisIndex === activeLesson;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => goToLesson(thisIndex)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 pl-10 text-left transition-all ${
                            isActive
                              ? "bg-indigo-500/10 border-l-2 border-indigo-500"
                              : "hover:bg-white/[0.02] border-l-2 border-transparent"
                          }`}
                        >
                          {lesson.completed ? (
                            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : lesson.type === "quiz" ? (
                            <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs truncate ${isActive ? "text-indigo-400 font-semibold" : "text-slate-400"}`}>
                              {lesson.title}
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-600 flex-shrink-0">
                            {lesson.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {/* update globalIndex for next section */}
                <span className="hidden">{(globalIndex += section.lessons.length)}</span>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
};

export default LearningPlayer;
