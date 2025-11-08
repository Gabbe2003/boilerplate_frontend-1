// components/PostShell.tsx

// <— If we only want to change the width of hero and body.
export const POST_MAX = "max-w-[75%]";

export function PostShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full ${POST_MAX} mx-auto px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}
