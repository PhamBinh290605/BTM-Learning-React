const NavIcon = ({ id }) => {
  const cls = "w-4 h-4";
  const icons = {
    grid: (
      <svg className={cls} viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
        <rect
          x="9"
          y="1"
          width="6"
          height="6"
          rx="1.5"
          fill="currentColor"
          opacity=".5"
        />
        <rect
          x="1"
          y="9"
          width="6"
          height="6"
          rx="1.5"
          fill="currentColor"
          opacity=".5"
        />
        <rect
          x="9"
          y="9"
          width="6"
          height="6"
          rx="1.5"
          fill="currentColor"
          opacity=".5"
        />
      </svg>
    ),
    monitor: (
      <svg className={cls} viewBox="0 0 16 16" fill="none">
        <rect
          x="1"
          y="2"
          width="14"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M5 15h6M8 12v3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    shield: (
      <svg className={cls} viewBox="0 0 16 16" fill="none">
        <path
          d="M2 4l6-3 6 3v5c0 3-6 5-6 5S2 12 2 9V4z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    zap: (
      <svg className={cls} viewBox="0 0 16 16" fill="none">
        <path
          d="M9 2L3 9h5l-1 5 6-7H8l1-5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    award: (
      <svg className={cls} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5.5 10l-2 5h9l-2-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    list: (
      <svg className={cls} viewBox="0 0 16 16" fill="none">
        <path
          d="M2 4h12M2 8h12M2 12h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    "credit-card": (
      <svg className={cls} viewBox="0 0 16 16" fill="none">
        <rect
          x="1"
          y="4"
          width="14"
          height="9"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M1 7h14" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    bell: (
      <svg className={cls} viewBox="0 0 16 16" fill="none">
        <path
          d="M8 2a4 4 0 00-4 4v3l-1.5 2h11L12 9V6a4 4 0 00-4-4z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M6.5 13.5a1.5 1.5 0 003 0"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    user: (
      <svg className={cls} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M2 14c0-2.8 2.2-5 5-5h2a5 5 0 015 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    book: (
      <svg className={cls} viewBox="0 0 16 16" fill="none">
        <path
          d="M2.5 4C4 3 6.5 3 8 4.5C9.5 3 12 3 13.5 4V13C12 12 9.5 12 8 13.5C6.5 12 4 12 2.5 13V4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 4.5V13.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "message-square": (
      <svg className={cls} viewBox="0 0 16 16" fill="none">
        <path
          d="M13.5 10.5C13.5 11.6 12.6 12.5 11.5 12.5H5.5L2.5 15.5V4.5C2.5 3.4 3.4 2.5 4.5 2.5H11.5C12.6 2.5 13.5 3.4 13.5 4.5V10.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="5" cy="7.5" r="0.75" fill="currentColor" />
        <circle cx="8" cy="7.5" r="0.75" fill="currentColor" />
        <circle cx="11" cy="7.5" r="0.75" fill="currentColor" />
      </svg>
    ),
    folder: (
      <svg className={cls} viewBox="0 0 16 16" fill="none">
        <path
          d="M2 4.5C2 3.4 2.9 2.5 4 2.5H6.5L8 4.5H12C13.1 4.5 14 5.4 14 6.5V11.5C14 12.6 13.1 13.5 12 13.5H4C2.9 13.5 2 12.6 2 11.5V4.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    tag: (
      <svg className={cls} viewBox="0 0 16 16" fill="none">
        <path
          d="M2 2.5H7.5L14 9L9 14L2.5 7.5V2.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="5" cy="5" r="1" fill="currentColor" />
      </svg>
    ),
  };
  return icons[id] || null;
};

export default NavIcon;
