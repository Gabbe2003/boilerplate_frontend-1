import React from 'react';

interface BookMarkProps {
  className?: string;
  color?: string;
  width?: number;
  style?: React.CSSProperties;
}

const BookMark: React.FC<BookMarkProps> = ({
  className,
  color = '#FB6A0B',
  width = 15,
  style,
}) => {
  const aspectRatio = 15 / 15;
  const height = width * aspectRatio;

  return (
    <span className={className}>
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width, height, ...style }}
      >
        <path d="M6 6L0 10.5V0H15V15L6 6Z" fill={color} />
      </svg>
    </span>
  );
};

export default BookMark;
