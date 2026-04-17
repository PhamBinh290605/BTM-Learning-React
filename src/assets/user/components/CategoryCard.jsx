const CategoryCard = ({ category, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer relative overflow-hidden bg-white dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200/80 dark:border-white/[0.06] hover:border-indigo-300 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-violet-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
        >
          {category.icon}
        </div>

        {/* Name */}
        <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {category.name}
        </h3>

        {/* Count */}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {category.courseCount} khóa học
        </p>
      </div>

      {/* Arrow icon */}
      <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2">
        <svg
          className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
};

export default CategoryCard;
