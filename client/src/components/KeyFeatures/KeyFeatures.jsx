import {
  MessageSquare,
  Navigation,
  ShieldCheck,
  TicketCheck,
  Unplug,
  Webhook,
} from "lucide-react";
import React from "react";

export default function KeyFeatures() {
  const features = [
    {
      icon: <Navigation className="size-7" />,
      title: "Real-Time Ride Tracking",
      description: "Track drivers and passengers on the map in real-time.",
    },
    {
      icon: <MessageSquare className="size-7" />,
      title: "Room-Based Chat",
      description:
        "Communicate instantly with your ride group or carpool room.",
    },
    {
      icon: <Unplug className="size-7" />,
      title: "Eco-Friendly Commuting",
      description: "Reduce your carbon footprint by sharing rides.",
    },
    {
      icon: <TicketCheck className="size-7" />,
      title: "Flexible Booking",
      description: "Schedule rides in advance or join on-demand rides.",
    },
    {
      icon: <Webhook className="size-7" />,
      title: "User-Friendly Interface",
      description: "Simple and intuitive design for students and commuters.",
    },
    {
      icon: <ShieldCheck className="size-7" />,
      title: "Safety Features",
      description: "Know who’s in your ride and share your trip status.",
    },
  ];
  return (
    <div className="flex flex-col my-8 gap-8">
        <h1 className="text-3xl font-bold text-start">Key Features</h1>
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, index) => {
          return (
            <div key={index} className="flex items-center bg-indigo-500/5 hover:bg-indigo-500 transition-all duation-200 border border-indigo-400 px-6 py-5 gap-4 rounded-xl">
              {feature.icon}
              <div className="flex flex-col justify-center text-start">
                <h1 className="text-xl font-bold">{feature.title}</h1>
                <p className="font-semibold">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
