"use client";

import React from 'react';
import { useUser } from "@clerk/nextjs";

const NewsMarquee = () => {
  // const newsText = "Techxos takes Tech to schools, for coding, robotics and game development.     Lets know your custom need. Send a mail to sales@techxos.com";
  const newsText = " ✅Techox just scaled to 32 Flutterwave-supported countries.  Pay in local currency in Nigria, Ghana, Kenya, Uganda, Rwanda, Egypt, South Africa, US, UK etc. Pay in USD from non-supported countires. Our seamless course purchase and enrollment system now enables you to learn on the go - from anywhere!!";

  const { user } = useUser();

  // Remove or comment out the console.log
  // console.log(user);

  const getDisplayName = () => {
    if (user?.firstName) {
      return user.firstName;
    } else if (user?.username) {
      return user.username.charAt(0).toUpperCase() + user.username.slice(1);
    }
    return "";
  };

  const getGreeting = () => {
    if (user?.firstName) {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return "Good morning";
      } else if (currentHour < 18) {
        return "Good afternoon";
      } else {
        return "Good evening";
      }
    } else if (user?.username) {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
    }
    return "";
  };

  return (
    // <div className="w-full bg-primary md:py-2 text-primary-foreground overflow-hidden">
    <div className="w-full bg-[#00468D] md:py-2 text-primary-foreground overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-0 flex flex-col md:flex-row md:justify-between items-center py-2 md:h-16">
        {user && (
          <div className="flex items-center md:mt-2 pl-4 w-full md:w-auto">
            <h1 className="text-white font-bold text-lg md:text-2xl">
            {getGreeting()}
          </h1>
            <span className="text-[#FFFF00] py-2 px-2 rounded-md font-bold text-lg md:text-2xl">
            {getDisplayName()}
          </span>
        </div>
        )}

        <div className={`w-[95%] md:w-[50%] self-end relative ${!user ? 'mt-0 ml-auto' : 'mt-4 md:mt-0'}`}>
          {/* Top News Badge - positioned at the end */}
          <div className="absolute top-0 right-0 z-10">
            <div 
              className="bg-[#FF0000] text-white px-6 py-1 clip-news font-bold"
              style={{
                clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)',
                marginRight: 0
              }}
            >
              Top News!
            </div>
          </div>

          {/* Smooth Scrolling Marquee */}
          <div className="w-[95%] overflow-hidden flex items-center h-8 bg-white relative">
            <div className="marquee-track whitespace-nowrap inline-flex will-change-transform">
              <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
              <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
              <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
              <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind Custom Styles */}
      <style jsx>{`
        .marquee-track {
          animation: marquee 60s linear infinite;
          display: inline-flex;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default NewsMarquee; 


// "use client";

// import React from 'react';

// const NewsMarquee = () => {
//   const newsText = "Techxos launches e-learning with a free JSS Mathematics course.     Date 19th-20th April 2025.     Time 05:00pm - 06:00pm.     Enroll now at our Mathematics page.     ";

//   return (
//     <div className="w-full bg-primary text-primary-foreground py-2 overflow-hidden mt-4">
//       <div className="max-w-[1400px] mx-auto px-0 flex justify-end">
//         <div className="w-full md:w-[50%] relative">
//           {/* Top News Badge - positioned at the end */}
//           <div className="absolute top-0 right-0 z-10">
//             <div 
//               className="bg-[#FF0000] text-white px-6 py-1 clip-news font-bold"
//               style={{
//                 clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)',
//               }}
//             >
//               Top News!
//             </div>
//           </div>

//           {/* Smooth Scrolling Marquee */}
//           <div className="w-full overflow-hidden flex items-center h-8 bg-white relative">
//             <div className="marquee-track whitespace-nowrap inline-flex will-change-transform">
//               <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
//               <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
//               <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
//               <span className="inline-block mr-16 font-bold text-black">{newsText}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tailwind Custom Styles */}
//       <style jsx>{`
//         .marquee-track {
//           animation: marquee 40s linear infinite;
//           display: inline-flex;
//         }

//         @keyframes marquee {
//           0% {
//             transform: translateX(0%);
//           }
//           100% {
//             transform: translateX(-50%);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default NewsMarquee; 