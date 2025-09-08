import React from 'react';

const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-12 gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className={`h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md ${j === 0 ? 'col-span-4' : j === cols - 1 ? 'col-span-2' : 'col-span-3'}`}></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;