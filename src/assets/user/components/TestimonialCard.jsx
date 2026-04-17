import StarRating from "./StarRating";

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.06] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Quote icon */}
      <div className="text-indigo-200 dark:text-indigo-500/20 mb-4">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
        </svg>
      </div>

      {/* Quote text */}
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-5 flex-1 text-[15px]">
        "{testimonial.quote}"
      </p>

      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={testimonial.rating} size="sm" />
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
        <div
          className={`w-11 h-11 rounded-full bg-gradient-to-br ${testimonial.avatarColor || "from-indigo-500 to-violet-500"} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}
        >
          {testimonial.avatar}
        </div>
        <div>
          <p className="font-semibold text-sm text-slate-900 dark:text-white">
            {testimonial.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
