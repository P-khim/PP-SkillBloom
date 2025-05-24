import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import { HOST, SET_USER_IMAGE, SET_USER_INFO } from "../utils/constants";

export default function Profile() {
  const router = useRouter();
  const [{ userInfo }, dispatch] = useStateProvider();
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const [image, setImage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({
    userName: "",
    fullName: "",
    description: "",
    createdAt: "",
  });

  
  useEffect(() => {
    if (userInfo) {
      setData({
        userName: userInfo.username || "",
        fullName: userInfo.fullName || "",
        description: userInfo.description || "",
        createdAt: userInfo.createdAt || "",
      });

      if (userInfo.isProfileSet === false) {
        setIsEditing(true);
      }

      if (userInfo.imageName) {
        const fileName = image;
        fetch(userInfo.imageName).then(async (response) => {
          const contentType = response.headers.get("content-type");
          const blob = await response.blob();
          const files = new File([blob], fileName, { type: contentType });
          setImage(files);
        });
      }

      setIsLoaded(true);
    }
  }, [userInfo]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (validTypes.includes(file.type)) {
      setImage(file);
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const setProfile = async () => {
    try {
      const response = await axios.post(
        SET_USER_INFO,
        { ...data },
        { withCredentials: true }
      );

      if (response.data.userNameError) {
        setErrorMessage("Enter a Unique Username");
        return;
      }

      let imageName = "";
      if (image) {
        const formData = new FormData();
        formData.append("images", image);
        const {
          data: { img },
        } = await axios.post(SET_USER_IMAGE, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        imageName = img;
      }

      dispatch({
        type: reducerCases.SET_USER,
        userInfo: {
          ...userInfo,
          ...data,
          image: imageName ? HOST + "/" + imageName : userInfo.image,
        },
      });

      setIsEditing(false);
      router.push("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoaded) return null;

  const formatCreatedAt = (dateString) => {
    try {
      if (!dateString) return "Unknown";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
      }).format(date);
    } catch (err) {
      return "Error formatting date";
    }
  };


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
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-gradient-to-b from-gray-900 to-gray-700 rounded-l-2xl p-6 text-white">
          <div className="flex flex-col items-center text-center">
            <div
              className="w-32 h-32 rounded-full border-2 border-white mb-3 relative overflow-hidden"
              onMouseEnter={() => setImageHover(true)}
              onMouseLeave={() => setImageHover(false)}
            >
              {image ? (
                <Image
                  src={URL.createObjectURL(image)}
                  alt="profile"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="bg-purple-500 w-full h-full flex items-center justify-center text-4xl">
                  {userInfo.email[0].toUpperCase()}
                </div>
              )}
              {imageHover && (
                <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFile}
                    accept="image/*"
                  />
                  <span className="text-white font-semibold">Change</span>
                </label>
              )}
            </div>

            <h2 className="text-xl font-semibold">{data.userName}</h2>
            <p className="text-gray-300 text-sm">Member since {formatCreatedAt(data.createdAt)}</p>

          </div>
        </aside>

        {/* Main Info */}
        <main className="w-full md:w-3/4 p-8 space-y-8 bg-white rounded-r-2xl">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Account Overview
          </h2>

          {errorMessage && (
            <p className="text-red-600 font-bold">{errorMessage}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
            <FormField
              label="Email"
              value={userInfo.email}
              readOnly={true}
            />
            <FormField
              label="Full Name"
              name="fullName"
              value={data.fullName}
              onChange={handleChange}
              editable={isEditing}
            />
            <FormField
              label="Username"
              name="userName"
              value={data.userName}
              onChange={handleChange}
              editable={isEditing}
            />
            <FormField
              label="Description"
              name="description"
              value={data.description}
              onChange={handleChange}
              editable={isEditing}
            />
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>

          {isEditing && (
            <button
              onClick={setProfile}
              className="ml-4 mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Profile
            </button>
          )}

          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Social Links
            </h3>
            <div className="flex items-center gap-6">
              <a
                href={`mailto:${userInfo.email}`}
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <FaFacebook /> {userInfo.email}
              </a>
              <a
                href={`mailto:${userInfo.email}`}
                className="flex items-center gap-2 text-blue-400 hover:underline"
              >
                <FaTwitter /> {userInfo.email}
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Unified form field for both view & edit mode
function FormField({ label, value, name, onChange, editable = false, readOnly = false }) {
  return (
    <div>
      <label className="text-xs text-gray-500 block mb-1">{label}</label>
      {editable && !readOnly ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      ) : (
        <p className="font-medium">{value || "—"}</p>
      )}
    </div>
  );
}
