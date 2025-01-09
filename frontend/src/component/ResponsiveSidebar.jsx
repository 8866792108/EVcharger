// "use client"
// import * as React from "react"
// import { cn } from "../assets/utility"
// import { Icons } from "../assets/Icons"
// import { NavLink, Route, Routes } from "react-router-dom";
// import Profile from "./Profile";

// const menuItems = [
//   { icon: "home", label: "Home", href: "/home", isActive: true },
//   { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
//   {
//     icon: "order",
//     label: "Order",
//     href: "/ordermanage"
//   },
//   { icon: "map", label: "Map", href: "/currentuser" },
//   { icon: "profile", label: "Profile", href: "/profile" }
// ]

// export default function ResponsiveSidebar() {
//   const [expanded, setExpanded] = React.useState(false)
//   const [activeSubmenu, setActiveSubmenu] = React.useState(null)

//   const toggleSubmenu = label => {
//     setActiveSubmenu(activeSubmenu === label ? null : label)
//   }

//   return (
//     <>
//     <Routes>
//       <Route path="/profile" element={<Profile/>} />
//     </Routes>
//       {/* Desktop Sidebar */}
//       <aside
//         className={cn(
//           "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r bg-[#171712] drop-shadow-[5px_5px_5px_rgba(0,0,0,0.55)] backdrop-blur-sm transition-all duration-300 md:flex",
//           expanded ? "w-64" : "w-16"
//         )}
//       >
//         <div className="flex h-16 items-center justify-between border-b px-3">
//           <h2 className={cn("text-lg font-semibold", !expanded && "hidden")}>
//             VoltHub
//           </h2>
//           <button
//             onClick={() => setExpanded(!expanded)}
//             className="rounded-lg p-1.5 hover:bg-accent"
//           >
//             <Icons.chevronDown
//               className={cn(
//                 "h-5 w-5 transform transition-transform",
//                 expanded ? "rotate-90" : "-rotate-90"
//               )}
//             />
//           </button>
//         </div>
//         <nav className="flex-1 space-y-[40px] p-2">
//           {menuItems.map(item => (
//             <div key={item.label}>
//               <NavLink
//                 to={item.href}
//                 onClick={() => item.submenu && toggleSubmenu(item.label)}
//                 className={cn(
//                   "group flex w-full items-center rounded-lg p-2 text-sm hover:bg-gray-700 hover:text-yellow-300 transform hover:scale-105 transition duration-200 cursor-pointer",
//                   item.isActive && "bg-primary text-primary-foreground",
//                   !expanded && "justify-center"
//                 )}
//               >
//                 {React.createElement(Icons[item.icon], {
//                   className: "h-7 w-7"
//                 })}
//                 {expanded && (
//                   <>
//                     <span className="ml-3 flex-1 truncate">{item.label}</span>
//                     {item.submenu && (
//                       <Icons.chevronDown
//                         className={cn(
//                           "h-4 w-4 transition-transform",
//                           activeSubmenu === item.label && "rotate-180"
//                         )}
//                       />
//                     )}
//                   </>
//                 )}
//               </NavLink>
//               {expanded && item.submenu && activeSubmenu === item.label && (
//                 <div className="h-0 m-auto space-y-2 flex flex-col justify-center items-center relative top-[-40px] left-[240px]">
//                   {item.submenu.map(subItem => (
//                     <a
//                       key={subItem.label}
//                       href={subItem.href}
//                       className="block rounded-lg px-2 py-1.5 text-sm w-full hover:bg-gray-700"
//                     >
//                       {subItem.label}
//                     </a>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </nav>
//       </aside>

//       {/* Mobile Bottom Navigation */}
//       <nav className="fixed bottom-0 left-0 z-40 w-full border-t bg-background bg-[#1c1919] drop-shadow-xl text-gray-100 md:hidden backdrop-blur-sm transition-all duration-300">
//         <div className="mx-auto flex h-16 max-w-md items-center justify-around px-6">
//           {menuItems.map(item => (
//             <div key={item.label} className="group relative">
//               <a
//                 href={item.href}
//                 onClick={() => item.submenu && toggleSubmenu(item.label)}
//                 className={cn(
//                   "flex flex-col items-center p-2 hover:bg-slate-400 rounded-md",
//                   item.isActive && "text-primary"
//                 )}
//               >
//                 {React.createElement(Icons[item.icon], {
//                   className: "h-6 w-6"
//                 })}
//               </a>

//               {/* Mobile Hover Label */}
//               <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform opacity-0 transition-opacity group-hover:opacity-100">
//                 <div className="whitespace-nowrap rounded-md bg-secondary px-2 py-1 text-sm">
//                   {item.label}
//                 </div>
//               </div>

//               {/* Mobile Submenu */}
//               {item.submenu && activeSubmenu === item.label && (
//                 <div className="absolute bottom-full left-0 mb-2 w-screen bg-popover p-4 shadow-lg">
//                   <div className="mx-auto max-w-md space-y-2">
//                     {item.submenu.map(subItem => (
//                       <a
//                         key={subItem.label}
//                         href={subItem.href}
//                         className="block rounded-lg p-2 hover:bg-accent"
//                       >
//                         {subItem.label}
//                       </a>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </nav>
//     </>
//   )
// }


"use client"
import * as React from "react"
import { cn } from "../assets/utility"
import { Icons } from "../assets/Icons"
import { NavLink, Route, Routes } from "react-router-dom";
import Profile from "./Profile";
import { useState } from "react";

const menuItems = [
  { icon: "home", label: "Home", href: "/home", isActive: true },
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  {
    icon: "order",
    label: "Order",
    href: "/ordermanage"
  },
  { icon: "map", label: "Map", href: "/currentuser" },
  { icon: "profile", label: "Profile", href: "/profile" }
]

export default function ResponsiveSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeSubmenu, setActiveSubmenu] = React.useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    // Trigger the animation after component mounts
    setIsOpen(true);
  }, []);

  const toggleSubmenu = label => {
    setActiveSubmenu(activeSubmenu === label ? null : label)
  }

  return (
    <>
      {/* Search Bar - Fixed to right side */}
      {/* <div className="fixed right-4 top-4 w-[300px] z-50">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-10 rounded-lg bg-[#1e1e1e] border border-gray-700 
                       text-white placeholder-gray-400 focus:outline-none focus:border-red-500 
                       focus:ring-1 focus:ring-red-500 shadow-lg backdrop-blur-sm"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div> */}

      <div className=" left-0 top-0 md:h-screen w-[350px] bg-[#121212] text-white p-4">
        <aside
          className={cn(
            "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-gray-700 bg-[#171712] drop-shadow-[5px_5px_5px_rgba(0,0,0,0.55)] backdrop-blur-sm transition-all duration-700 ease-in-out md:flex",
            isOpen ? "w-[350px] opacity-100" : "w-0 opacity-0"
          )}
        >
          <div className={cn(
            "flex h-40 items-center justify-center border-b border-gray-700 mb-5 transition-all duration-700 delay-300",
            isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          )}>
            <h2 className="text-4xl font-bold">
              <span className="text-[#db0000]">Volt</span>
              <span className="text-white">Hub</span>
            </h2>
            <div className="logo_shadow"></div>
          </div>
          <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            <div className="space-y-[20px] p-6">
              {menuItems.map((item, index) => (
                <div
                  key={item.label}
                  className={cn(
                    "transition-all duration-500",
                    isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10",
                    // Add staggered delay for each item
                    `delay-[${400 + (index * 100)}ms]`
                  )}
                >
                  <NavLink
                    to={item.href}
                    onClick={() => item.submenu && toggleSubmenu(item.label)}
                    className={({ isActive }) => cn(
                      "group flex w-full items-center rounded-lg p-3 transition duration-200 cursor-pointer",
                      isActive
                        ? "bg-gray-800 text-[#db0000] scale-105"
                        : "text-gray-400 hover:bg-gray-700 hover:text-[#db0000] hover:scale-105"
                    )}
                  >
                    {React.createElement(Icons[item.icon], {
                      className: "h-7 w-7"
                    })}
                    <span className="ml-4 flex-1 font-semibold">
                      {item.label}
                    </span>
                  </NavLink>
                </div>
              ))}
            </div>
          </nav>
        </aside>




        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 z-40 w-full border-t bg-background bg-[#1c1919] drop-shadow-xl text-gray-100 md:hidden backdrop-blur-sm transition-all duration-300">
          <div className="mx-auto flex h-16 max-w-md items-center justify-around px-6">
            {menuItems.map(item => (
              <div key={item.label} className="group relative">
                <a
                  href={item.href}
                  onClick={() => item.submenu && toggleSubmenu(item.label)}
                  className={cn(
                    "flex flex-col items-center p-2 hover:bg-slate-400 rounded-md",
                    item.isActive && "text-primary"
                  )}
                >
                  {React.createElement(Icons[item.icon], {
                    className: "h-6 w-6"
                  })}
                </a>

                {/* Mobile Hover Label */}
                <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="whitespace-nowrap rounded-md bg-secondary px-2 py-1 text-sm">
                    {item.label}
                  </div>
                </div>

                {/* Mobile Submenu */}
                {item.submenu && activeSubmenu === item.label && (
                  <div className="absolute bottom-full left-0 mb-2 w-screen bg-popover p-4 shadow-lg">
                    <div className="mx-auto max-w-md space-y-2">
                      {item.submenu.map(subItem => (
                        <a
                          key={subItem.label}
                          href={subItem.href}
                          className="block rounded-lg p-2 hover:bg-accent"
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  )
}
