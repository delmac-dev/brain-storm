"use client";

export function GridBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    </div>
  );
}
