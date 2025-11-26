interface SectionBreakerProps {
  color?: string;
}

export default function SectionBreaker({ color = "red" }: SectionBreakerProps) {
  return (
    <div className="w-full mb-2">
      <hr className="border-t border-gray-600" />

      <span
        style={{
          display: "block",
          width: "32%",
          maxWidth: "100px",
          borderLeft: "0 solid transparent",
          borderRight: "8px solid transparent",
          borderTop: `6px solid ${color}`,
          marginTop: "-0.7px", // 👈 pulls it up to hide the line
        }}
      />
    </div>
  );
}
