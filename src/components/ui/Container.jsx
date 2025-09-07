import React from "react";

function classNames(...c) { return c.filter(Boolean).join(" "); }

export const Container = ({ children, className = "" }) => (
  <div className={classNames("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
    {children}
  </div>
);