import React from 'react'
import ResponsiveSidebar from './ResponsiveSidebar'
import currentuser from '../assets/img/Profile.png'
import { Link, NavLink } from 'react-router-dom'
import { Icons } from '../assets/Icons'

const Profile = () => {

  const menuItems = [
    { icon: "order", label: "orders management", href: "/ordermng", isActive: true },
    { icon: "logout", label: "Logout", href: "/login" }
  ]

  return (
    <div className='home flex justify-center items-center'>
      <ResponsiveSidebar />
      <main className="md:pl-16 md:transition-all md:duration-300 md:data-[expanded=true]:pl-64 w-full">
        <div
          class=" lg:min-w-[95%] min-w-[80%] mx-4 max-w-lg sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900">
          <div class="rounded-t-lg h-32 overflow-hidden">
            <img class="object-cover object-top w-full" src='https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ' alt='Mountain' />
          </div>
          <button className="flex relative left-[60%] top-[91px]">
            <svg class="w-4 fill-current text-blue-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path
                d="M7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c2.15 0 4.2.4 6.1 1.09L12 16h-1.25L10 20H4l-.75-4H2L.9 10.09A17.93 17.93 0 0 1 7 9zm8.31.17c1.32.18 2.59.48 3.8.92L18 16h-1.25L16 20h-3.96l.37-2h1.25l1.65-8.83zM13 0a4 4 0 1 1-1.33 7.76 5.96 5.96 0 0 0 0-7.52C12.1.1 12.53 0 13 0z" />
            </svg>
          </button>
          <div class="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
            <img class="object-cover object-center h-32" src={currentuser} alt='Woman looking front' />
          </div>
          <div class="text-center mt-2">
            <h2 class="font-semibold">{localStorage.getItem('loggeduser') || "Guest"}</h2>
            <p class="text-gray-500">sanjaychilgani119@gmail.com</p>
          </div>
          {/* <ul class="py-4 mt-2 text-gray-700 flex items-center justify-around">

            <li class="flex flex-col items-center justify-between">
              <svg class="w-4 fill-current text-blue-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path
                  d="M7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c2.15 0 4.2.4 6.1 1.09L12 16h-1.25L10 20H4l-.75-4H2L.9 10.09A17.93 17.93 0 0 1 7 9zm8.31.17c1.32.18 2.59.48 3.8.92L18 16h-1.25L16 20h-3.96l.37-2h1.25l1.65-8.83zM13 0a4 4 0 1 1-1.33 7.76 5.96 5.96 0 0 0 0-7.52C12.1.1 12.53 0 13 0z" />
              </svg>
              <div>10k</div>
            </li>
          </ul> */}
          <Link to="/login"  >
            <button class=" block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">Login</button>
          </Link>
          <div class="p-4 border-t mx-8 mt-2 flex flex-col gap-6">

            <div className="flex w-full gap-[15px] justify-evenly flex-col flex-wrap md:flex-row items-center">
              {/* <div className="flex flex-row w-full md:w-[45%] lg:w-[35%] items-center justify-between mx-[5px] p-[10px] bg-sky-500 rounded-full hover:drop-shadow-4xl">
                <div className="left flex gap-4">
                  <svg class="w-4 fill-current text-blue-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path
                      d="M7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c2.15 0 4.2.4 6.1 1.09L12 16h-1.25L10 20H4l-.75-4H2L.9 10.09A17.93 17.93 0 0 1 7 9zm8.31.17c1.32.18 2.59.48 3.8.92L18 16h-1.25L16 20h-3.96l.37-2h1.25l1.65-8.83zM13 0a4 4 0 1 1-1.33 7.76 5.96 5.96 0 0 0 0-7.52C12.1.1 12.53 0 13 0z" />
                  </svg>
                  <span>Order Manage</span>
                </div>
                <div className="right">
                  <svg class="w-4 fill-current text-blue-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path
                      d="M7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c2.15 0 4.2.4 6.1 1.09L12 16h-1.25L10 20H4l-.75-4H2L.9 10.09A17.93 17.93 0 0 1 7 9zm8.31.17c1.32.18 2.59.48 3.8.92L18 16h-1.25L16 20h-3.96l.37-2h1.25l1.65-8.83zM13 0a4 4 0 1 1-1.33 7.76 5.96 5.96 0 0 0 0-7.52C12.1.1 12.53 0 13 0z" />
                  </svg>
                </div>
              </div> */}

              {menuItems.map(item => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className="flex flex-row w-full md:w-[45%] lg:w-[35%] items-center justify-between mx-[5px] p-[10px] bg-sky-500 rounded-full hover:drop-shadow-4xl"
                >
                  <div className="left flex gap-4">
                    {React.createElement(Icons[item.icon], {
                      className: "h-7 w-7"
                    })}
                    <span>{item.label}</span>
                  </div>
                  <div className="right">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" class="injected-svg" data-src="https://cdn.hugeicons.com/icons/arrow-right-01-solid-rounded.svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#bd10e0">
                      <path d="M8.19486 5.40705C8.52237 4.96235 9.14837 4.86736 9.59306 5.19488C9.93847 5.44927 10.2668 5.70372 10.5528 5.92689C11.1236 6.3724 11.8882 6.98573 12.6556 7.65208C13.4181 8.31412 14.2064 9.04815 14.8119 9.73344C15.1136 10.0749 15.3911 10.4279 15.5986 10.7721C15.7895 11.0888 16 11.524 16 12.0001C16 12.4762 15.7895 12.9115 15.5986 13.2282C15.3911 13.5724 15.1136 13.9253 14.8119 14.2668C14.2064 14.9521 13.4181 15.6861 12.6556 16.3482C11.8882 17.0145 11.1236 17.6278 10.5528 18.0734C10.2668 18.2965 9.93847 18.551 9.59307 18.8054C9.14837 19.1329 8.52237 19.0379 8.19486 18.5932C8.0632 18.4144 7.99983 18.2064 8.00001 18.0002L8 12.0001L8 6.00007C7.99983 5.79387 8.0632 5.58581 8.19486 5.40705Z" fill="#bd10e0"></path>
                    </svg>
                  </div>
                </NavLink>

              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile