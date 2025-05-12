import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function PopularServices() {
  const router = useRouter();
  const popularServicesData = [
    {
      name: "Ai Artists",
      label: "Add talent to AI",
      image: "/service1.png",
      description: "Create unique artwork with AI tools",
    },
    {
      name: "Logo Design",
      label: "Build your brand",
      image: "/service2.jpeg",
      description: "Craft professional logos for businesses",
    },
    {
      name: "Wordpress",
      label: "Customize your site",
      image: "/service3.jpeg",
      description: "Design and optimize WordPress websites",
    },
    {
      name: "Voice Over",
      label: "Share your message",
      image: "/service4.jpeg",
      description: "Create impactful voice-over recordings",
    },
    {
      name: "Social Media",
      label: "Reach more customers",
      image: "/service5.jpeg",
      description: "Boost your presence across social media platforms",
    },
    {
      name: "SEO",
      label: "Unlock growth online",
      image: "/service6.jpeg",
      description: "Improve search engine rankings for your site",
    },
    {
      name: "Illustration",
      label: "Color your dreams",
      image: "/service7.jpeg",
      description: "Bring your ideas to life with custom illustrations",
    },
    {
      name: "Translation",
      label: "Go global",
      image: "/service8.jpeg",
      description: "Translate documents and content into multiple languages",
    },
  ];

  return (
    <div className="mx-20 my-16">
      <h2 className="text-4xl mb-5 text-[#404145] font-bold">
        Popular Services
      </h2>
      <ul className="flex flex-wrap gap-16">
        {popularServicesData.map(({ name, label, image, description }) => {
          return (
            <li
              key={name}
              className="relative cursor-pointer group rounded-lg overflow-hidden" // Added rounded-lg and overflow-hidden
              onClick={() => router.push(`/search?q=${name.toLowerCase()}`)}
            >
              {/* Hover Overlay with full dark transparent background */}
              <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:opacity-100 opacity-0 transition-all duration-300 z-10 flex items-center justify-center p-5">
                <div className="text-white text-center">
                  <p className="mb-3">{description}</p>
                </div>
              </div>
              <div className="absolute z-20 text-white left-5 top-4">
                <span>{label}</span>
                <h6 className="font-extrabold text-2xl">{name}</h6>
              </div>
              <div className="h-80 w-72 relative group-hover:opacity-60 transition-all duration-300">
                <Image src={image} fill alt="service" className="rounded-lg" />{" "}
                {/* Added rounded-lg to the image */}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PopularServices;
