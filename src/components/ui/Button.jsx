import React from "react";

function classNames(...c) { return c.filter(Boolean).join(" "); }

export const Button = ({ children, href, onClick, className = "", type = "button", as }) => {
  const classes = classNames(
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium shadow-sm transition-colors",
    "bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-900",
    "dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white/90",
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 dark:focus:ring-offset-zinc-950 dark:focus:ring-zinc-400",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    className
  );

  if (as === "a" || href) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
};
