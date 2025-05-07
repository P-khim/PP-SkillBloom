import Image from "next/image";
import React from "react";

function Companies() {
  return (
    <div className="flex items-center justify-center text-gray-400 text-2xl font-bold min-h-[11vh]">
      Trusted by: &nbsp;
      <ul className="flex gap-10 ml-10">
        {[1, 2, 3, 4, 5].map((num) => (
          <li key={num} className="relative w-[4.5rem] flex justify-center items-center">
            <div className="w-full h-0 pb-[100%] relative"> {/* Aspect ratio container */}
              <Image
                src={`/trusted${num}.png`}
                alt="trusted brands"
                fill // Replaces layout="fill"
                objectFit="contain" // Keeps the image in proportion
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Companies;
