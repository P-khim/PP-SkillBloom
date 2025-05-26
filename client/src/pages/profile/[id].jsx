import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { HOST } from "../../utils/constants";

const PublicProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const [userData, setUserData] = useState(undefined); // undefined = loading, null = error

  useEffect(() => {
    if (!id) return;

    fetch(`${HOST}/api/auth/get-user-info/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => setUserData(data))
      .catch((err) => {
        console.error(err);
        setUserData(null);
      });
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(date);
  };

  if (userData === undefined)
    return <p className="text-center py-10">Loading...</p>;

  if (userData === null)
    return <p className="text-center py-10 text-red-600">User not found.</p>;

  return (
    <div className="relative min-h-screen flex justify-center items-center py-24 bg-black">
      <div className="absolute inset-0 z-0">
        <img
          src="/business.jpg"
          alt="Background"
          className="w-full h-full object-cover object-center blur-sm opacity-30"
        />
      </div>

      <div className="relative z-10 flex w-[90%] max-w-6xl bg-white bg-opacity-90 rounded-2xl shadow-lg overflow-hidden">
        <aside className="w-full md:w-1/4 bg-gradient-to-b from-gray-900 to-gray-700 rounded-l-2xl p-6 text-white">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full border-2 border-white mb-3 relative overflow-hidden">
              {userData.imageName ? (
                <Image
                  src={userData.imageName}
                  alt="profile"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="bg-purple-500 w-full h-full flex items-center justify-center text-4xl">
                  {userData.email[0].toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold">{userData.username || "N/A"}</h2>
            <p className="text-gray-300 text-sm">
              Member since {formatDate(userData.createdAt)}
            </p>
          </div>
        </aside>

        <main className="w-full md:w-3/4 p-8 space-y-6 bg-white rounded-r-2xl">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Public Profile</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
            <ViewField label="Email" value={userData.email} />
            <ViewField label="Full Name" value={userData.fullName} />
            <ViewField label="Username" value={userData.username} />
            <ViewField label="Gender" value={userData.gender} />
            <ViewField label="Birthday" value={userData.birthday} />
            <ViewField label="City" value={userData.city} />
            <ViewField label="Country" value={userData.country || "Cambodia"} />
            <ViewField label="Description" value={userData.description} />
            <ViewField label="Languages" value={(userData.languages || []).join(", ")} />
            <ViewField label="Professions" value={(userData.professions || []).join(", ")} />
            <ViewField label="Facebook" value={userData.facebookLink} isLink />
            <ViewField label="Telegram" value={userData.telegramLink} isLink />
          </div>
        </main>
      </div>
    </div>
  );
};

const ViewField = ({ label, value, isLink = false }) => (
  <div>
    <label className="block text-gray-500 font-semibold mb-1">{label}</label>
    {isLink && value ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {value}
      </a>
    ) : (
      <p className="text-gray-800">{value || "N/A"}</p>
    )}
  </div>
);

export default PublicProfile;
