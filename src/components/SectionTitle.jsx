import React from "react";

export const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-12 text-center">
    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-3 text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">{subtitle}</p>
    )}
  </div>
);