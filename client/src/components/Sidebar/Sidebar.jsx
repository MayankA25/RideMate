import {
  ArrowUp,
  Car,
  ChevronsRight,
  ChevronUp,
  LockKeyhole,
  Megaphone,
  ShipWheel,
  Signature,
  TicketCheck,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  console.log("Location: ", location.pathname);
  const [toggle, setToggle] = useState(false);
  const tabs = [
    {
      icon: <Car className="size-7" />,
      title: "Available Rides",
      path: "/dashboard/rides",
    },
    {
      icon: <ShipWheel className="size-7" />,
      title: "Your Rides",
      path: "/dashboard/your-rides",
    },
    {
      icon: <TicketCheck className="size-7" />,
      title: "Your Bookings",
      path: "/dashboard/bookings",
    },
    {
      icon: <Megaphone className="size-7"/>,
      title: "Ride Alerts",
      path: "/dashboard/ride-alerts"
    },
    {
      icon: <LockKeyhole className="size-7" />,
      title: "Manage Users",
      path: "/dashboard/users",
    },
    {
      icon: <Signature className="size-7" />,
      title: "Document Requests",
      path: "/dashboard/requests",
    },
  ];
  return (
    <div
      className={`flex ${
        toggle ? "w-[40%] lg:w-[18%]" : "w-[10%] lg:w-[5%]"
      } min-h-full rounded-r-xl transition-all duration-200 fixed top-0 z-100`}
    >
      <div className="w-full h-[100vh] bg-base-300 rounded-r-xl">

      
      <div
        className={``}
      >
        <div
          className={`flex items-center justify-center absolute top-[50%] left-[100%] transform -translate-x-[50%] bg-base-200 p-2 rounded-full border border-primary cursor-pointer ${
            toggle ? "rotate-180" : "rotate-0"
          } transition-all duration-300`}
          onClick={() => {
            setToggle(toggle ? false : true);
          }}
        >
          <ChevronsRight />
        </div>
        <div className="flex flex-col gap-2 w-full py-20">
          {tabs.map((tab, index) => {
            if (index > 3 && user.role != "SuperAdmin") return;
            return (
              <div
                key={index}
                className={`flex items-center gap-4  hover:bg-indigo-500 transition-all duration-500 cursor-pointer ${
                  toggle ? "w-[95%]" : "w-[60%]"
                } mx-auto py-4 px-4 rounded-xl ${
                  location.pathname == tab.path
                    ? "bg-indigo-500"
                    : "bg-indigo-500/0"
                }`}
                onClick={() => {
                  navigate(tab.path);
                  setToggle(false);
                }}
              >
                {tab.icon}
                {toggle && <p className="text-lg font-bold">{tab.title}</p>}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between w-full absolute bottom-5 py-3 px-5">
          <div className="flex items-center gap-3">
            <img
              src={
                user?.profilePic ||
                "https://images.pexels.com/photos/47547/squirrel-animal-cute-rodents-47547.jpeg"
              }
              alt=""
              className="size-10 rounded-full object-contain bg-base-100"
            />
            {toggle && <h1 className="font-bold text-lg">{user?.firstName}</h1>}
          </div>
          {toggle && (
            <div className="dropdown dropdown-top">
              <div
                tabIndex={0}
                className="mx-1 hover:bg-neutral/50 p-2 rounded-lg transform"
              >
                <ChevronUp />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 py-3 shadow-sm"
              >
                <li onClick={() => navigate(`/account/${user._id}`)}>
                  <a className="font-bold">Account</a>
                </li>
                <li onClick={() => logout()}>
                  <a className="font-bold">LogOut</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
