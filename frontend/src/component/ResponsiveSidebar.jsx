"use client"
import * as React from "react"
import { cn } from "../assets/utility"
import { Icons } from "../assets/Icons"
import { NavLink, Route, Routes } from "react-router-dom";
import Profile from "./Profile";

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
  const [expanded, setExpanded] = React.useState(false)
  const [activeSubmenu, setActiveSubmenu] = React.useState(null)

  const toggleSubmenu = label => {
    setActiveSubmenu(activeSubmenu === label ? null : label)
  }

  return (
    <>
    <Routes>
      <Route path="/profile" element={<Profile/>} />
    </Routes>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r bg-[#171712] drop-shadow-[5px_5px_5px_rgba(0,0,0,0.55)] backdrop-blur-sm transition-all duration-300 md:flex",
          expanded ? "w-64" : "w-16"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-3">
          <h2 className={cn("text-lg font-semibold", !expanded && "hidden")}>
            VoltHub
          </h2>
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg p-1.5 hover:bg-accent"
          >
            <Icons.chevronDown
              className={cn(
                "h-5 w-5 transform transition-transform",
                expanded ? "rotate-90" : "-rotate-90"
              )}
            />
          </button>
        </div>
        <nav className="flex-1 space-y-[40px] p-2">
          {menuItems.map(item => (
            <div key={item.label}>
              <NavLink
                to={item.href}
                onClick={() => item.submenu && toggleSubmenu(item.label)}
                className={cn(
                  "group flex w-full items-center rounded-lg p-2 text-sm hover:bg-gray-700 hover:text-yellow-300 transform hover:scale-105 transition duration-200 cursor-pointer",
                  item.isActive && "bg-primary text-primary-foreground",
                  !expanded && "justify-center"
                )}
              >
                {React.createElement(Icons[item.icon], {
                  className: "h-7 w-7"
                })}
                {expanded && (
                  <>
                    <span className="ml-3 flex-1 truncate">{item.label}</span>
                    {item.submenu && (
                      <Icons.chevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          activeSubmenu === item.label && "rotate-180"
                        )}
                      />
                    )}
                  </>
                )}
              </NavLink>
              {expanded && item.submenu && activeSubmenu === item.label && (
                <div className="h-0 m-auto space-y-2 flex flex-col justify-center items-center relative top-[-40px] left-[240px]">
                  {item.submenu.map(subItem => (
                    <a
                      key={subItem.label}
                      href={subItem.href}
                      className="block rounded-lg px-2 py-1.5 text-sm w-full hover:bg-gray-700"
                    >
                      {subItem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
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
    </>
  )
}
