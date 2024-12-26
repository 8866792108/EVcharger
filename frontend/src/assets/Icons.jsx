export const Icons = {
  home: props => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  dashboard: props => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  order: props => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/shopping-bag-02-stroke-standard.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#ffffff">
      <path d="M8 8V6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6V8" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"></path>
      <path d="M14.5 11C14.5 12.3807 13.3807 13.5 12 13.5C10.6193 13.5 9.5 12.3807 9.5 11" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M19 8L5 8L3.48918 18.5757C3.23099 20.383 4.63338 22 6.45903 22L17.541 22C19.3666 22 20.769 20.383 20.5108 18.5757L19 8Z" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"></path>
    </svg>

  ),
  map: props => (
    <svg width="24" height="24" viewBox="0 0 24 24" stroke="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 4.5C1.5 2.84315 2.84315 1.5 4.5 1.5H19.5C21.1569 1.5 22.5 2.84315 22.5 4.5V19.5C22.5 21.1569 21.1569 22.5 19.5 22.5H4.5C4.18669 22.5 3.8846 22.452 3.60069 22.3629C3.40322 22.3009 3.36002 22.0542 3.50636 21.9079L10.5248 14.8894C10.642 14.7723 10.8319 14.7723 10.9491 14.8894L16.5597 20.5H19.5C20.0523 20.5 20.5 20.0523 20.5 19.5V4.5C20.5 3.94772 20.0523 3.5 19.5 3.5H4.5C3.94772 3.5 3.5 3.94772 3.5 4.5V7.44032L9.11062 13.0509C9.22777 13.1681 9.22777 13.358 9.11062 13.4752L2.09213 20.4937C1.94579 20.64 1.69911 20.5968 1.63714 20.3994C1.54803 20.1154 1.5 19.8133 1.5 19.5V4.5Z" fill="#141B34" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 5.25C12.126 5.25 10.25 7.24109 10.25 9.63632C10.25 10.9458 10.8263 11.9167 11.4935 12.7103C11.8015 13.0765 12.1426 13.4208 12.4593 13.7404L12.5207 13.8025C12.8633 14.1485 13.1766 14.4691 13.4485 14.8055C13.9751 15.4573 15.0127 15.4814 15.5596 14.8258C15.8356 14.495 16.1476 14.1765 16.4856 13.8313L16.503 13.8136C16.8395 13.47 17.2017 13.0993 17.5271 12.7023C18.1856 11.899 18.75 10.9211 18.75 9.63632C18.75 7.24109 16.874 5.25 14.5 5.25ZM14.5 8C13.6716 8 13 8.67157 13 9.5C13 10.3284 13.6716 11 14.5 11H14.509C15.3374 11 16.009 10.3284 16.009 9.5C16.009 8.67157 15.3374 8 14.509 8H14.5Z" fill="#141B34" />
    </svg>

  ),
  calendar: props => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  profile: props => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  chevronDown: props => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}
