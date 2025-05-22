// pages/profile.js
import { FaFacebook, FaTwitter } from "react-icons/fa";

export default function Profile() {
  const user = {
    image: "/service1.png",
    username: "Jessie Lane",
    email: "jessieLane@gmail.com",
    gender: "Female",
    birthday: "12 October 1992",
    job: "UI designer, writer",
    language: "English",
    country: "Cambodia",
    city: "Phnom Penh",
    facebook: "example@gmail.com",
    twitter: "example@gmail.com",
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center py-24 bg-black">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/business.jpg"
          alt="Background"
          className="w-full h-full object-cover object-center blur-sm opacity-30"
          loading="lazy"
        />
      </div>

      {/* Profile Card */}
      <div className="relative z-10 flex w-[90%] max-w-6xl bg-white bg-opacity-90 rounded-2xl shadow-lg overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-gradient-to-b from-gray-900 to-gray-700 rounded-l-2xl p-6 text-white">
          <div className="flex flex-col items-center text-center">
            <img
              src={user.image}
              alt="Profile"
              className="w-32 h-32 rounded-full border-2 border-white mb-3"
              loading="lazy"
            />
            <h2 className="text-xl font-semibold">{user.username}</h2>
            <p className="text-gray-300 text-sm">Member since 2022</p>

            <nav className="mt-10 space-y-4 w-full text-left">
              <div className="text-white font-medium">Account</div>
              <div className="text-gray-400">Security &amp; Privacy</div>
              <div className="text-gray-400">History</div>
            </nav>
          </div>
        </aside>

        {/* Info Section */}
        <main className="w-full md:w-3/4 p-8 space-y-8 bg-white rounded-r-2xl">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Account Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
            <Display label="Email" value={user.email} />
            <Display label="Gender" value={user.gender} />
            <Display label="Birthday" value={user.birthday} />
            <Display label="Job" value={user.job} />
            <Display label="Language" value={user.language} />
            <Display label="Country" value={user.country} />
            <Display label="City" value={user.city} />
          </div>

          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Social Links
            </h3>
            <div className="flex items-center gap-6">
              <a
                href={`mailto:${user.facebook}`}
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <FaFacebook /> {user.facebook}
              </a>
              <a
                href={`mailto:${user.twitter}`}
                className="flex items-center gap-2 text-blue-400 hover:underline"
              >
                <FaTwitter /> {user.twitter}
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Component to display a label and value pair
function Display({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
