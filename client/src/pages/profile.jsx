import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import {
  HOST,
  SET_USER_IMAGE,
  SET_USER_INFO,
} from "../utils/constants";

export default function Profile() {
  const router = useRouter();
  const [{ userInfo }, dispatch] = useStateProvider();
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const [image, setImage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false); // added
  const [data, setData] = useState({
    userName: "",
    fullName: "",
    description: "",
  });

  useEffect(() => {
    if (userInfo) {
      setData({
        userName: userInfo.username || "",
        fullName: userInfo.fullName || "",
        description: userInfo.description || "",
      });

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

      setIsEditing(false); // close editor
      router.push("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="relative min-h-screen flex justify-center items-center py-24 bg-black">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/business.jpg"
          alt="Background"
          className="w-full h-full object-cover object-center blur-sm opacity-30"
        />
      </div>

      {/* Profile Card */}
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

          {errorMessage && (
            <p className="text-red-600 font-bold">{errorMessage}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
            <Display label="Email" value={userInfo.email} />
            <Display label="Full Name" value={data.fullName} />
            <Display label="Username" value={data.userName} />
            <Display label="Description" value={data.description} />
          </div>

          {/* Toggle Edit Button */}
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>

          {/* Inputs and Save Button only visible when editing */}
          {isEditing && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                <Input
                  label="Username"
                  name="userName"
                  value={data.userName}
                  onChange={handleChange}
                />
                <Input
                  label="Full Name"
                  name="fullName"
                  value={data.fullName}
                  onChange={handleChange}
                />
                <Input
                  label="Description"
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                />
              </div>

              <button
                onClick={setProfile}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Profile
              </button>
            </>
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

function Display({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-700 font-semibold">{label}</label>
      <input
        type="text"
        name={name}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
