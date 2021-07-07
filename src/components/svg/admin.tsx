import React from 'react';

export const AdminIcon = ({
  className,
  width,
  height,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2454"
    >
      <path
        d="M512 1024C229.2224 1024 0 794.7776 0 512 0 229.2224 229.2224 0 512 0 794.7776 0 1024 229.2224 1024 512 1024 794.7776 794.7776 1024 512 1024ZM819.2 307.2 563.2 307.2 563.2 409.6 597.1456 409.6C568.5248 479.3856 539.8528 548.096 512 613.5296 484.1472 548.096 455.4752 479.3856 426.8544 409.6L460.8 409.6 460.8 307.2 204.8 307.2 204.8 409.6 316.416 409.6C421.3248 666.5728 512 870.4 512 870.4 512 870.4 602.624 666.5728 707.584 409.6L819.2 409.6 819.2 307.2Z"
        p-id="3184"
        fill="#efb336"
      ></path>
    </svg>
  );
};
