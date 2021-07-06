import React from "react"

export const VerifyIcon = ({ className }: { className?: string }) => {
  return <svg className={className} width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8.5" r="8" fill="url(#paint0_linear)" />
    <path d="M4.5 8.5L7 11L12 6" stroke="white" stroke-width="1.5" />
    <defs>
      <linearGradient id="paint0_linear" x1="21.3333" y1="13.8333" x2="1.33333" y2="13.8333" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2663FF" />
        <stop offset="1" stopColor="#FF3828" />
      </linearGradient>
    </defs>
  </svg>

}