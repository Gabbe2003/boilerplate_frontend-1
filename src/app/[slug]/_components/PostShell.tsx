// components/PostShell.tsx

// <— If we only want to change the width of hero and body.
export const POST_MAX = "max-w-[90%]";

export function PostShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="base-width-for-all-pages">
      <div className={`w-full ${POST_MAX}  mx-auto ${className}`}>
        {children}
      </div>
    </div>
  );
}
