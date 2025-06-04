import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import { HOST, SET_USER_IMAGE, SET_USER_INFO } from "../utils/constants";

const genderOptions = ['Male', 'Female', 'Other'];
const languageOptions = ['Khmer', 'English', 'Thai', 'Chinese', 'Japanese', 'French'];
const professionOptions = ['Dentist', 'Developer', 'Designer', 'Teacher', 'Engineer', 'Writer'];
const provinceOptions = [
  "Phnom Penh", "Kandal", "Takeo", "Kampot", "Kep", "Sihanoukville", "Koh Kong",
  "Pursat", "Battambang", "Banteay Meanchey", "Siem Reap", "Oddar Meanchey",
  "Preah Vihear", "Stung Treng", "Ratanakiri", "Mondulkiri", "Kratie", "Kampong Cham",
  "Tboung Khmum", "Kampong Chhnang", "Kampong Thom", "Kampong Speu", "Prey Veng",
  "Svay Rieng", "Pailin"
];


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
    birthday: "",
    city: "",
    country: "Cambodia",
    facebookLink: "",
    gender: "",
    languages: "",
    professions: "",
    telegramLink: "",
  });

  useEffect(() => {
    if (userInfo) {
      setData({
        userName: userInfo.username || "",
        fullName: userInfo.fullName || "",
        description: userInfo.description || "",
        createdAt: userInfo.createdAt || "", 
        birthday: userInfo.birthday || "",
        city: userInfo.city || "",
        country: userInfo.country || "Cambodia",
        facebookLink: userInfo.facebookLink || "",
        gender: userInfo.gender || "",
        languages: (userInfo.languages || []).join(", "),
        professions: (userInfo.professions || []).join(", "),
        telegramLink: userInfo.telegramLink || "",
      });

      if (userInfo.isProfileSet === false) setIsEditing(true);

      if (userInfo.imageName) {
        fetch(userInfo.imageName).then(async (response) => {
          const contentType = response.headers.get("content-type");
          const blob = await response.blob();
          const files = new File([blob], image, { type: contentType });
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
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const setProfile = async () => {
    try {
      const response = await axios.post(
        SET_USER_INFO,
        {
          ...data,
          languages: data.languages.split(",").map((s) => s.trim()),
          professions: data.professions.split(",").map((s) => s.trim()),
        },
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
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageName = img;
      }

      dispatch({
        type: reducerCases.SET_USER,
        userInfo: {
          ...userInfo,
          ...data,
          languages: data.languages.split(",").map((s) => s.trim()),
          professions: data.professions.split(",").map((s) => s.trim()),
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
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatBirtday = (dateString) => {
    if(!dateString) return "Unknown";
    const date = new Date(dateString);
    if(isNaN(date)) return "Invalid Date";
    return new Intl.DateTimeFormat("en-US",{
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const toDateInputValue = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    return date.toISOString().split("T")[0];
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

        <main className="w-full md:w-3/4 p-8 space-y-6 bg-white rounded-r-2xl">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Account Overview</h2>

          {errorMessage && <p className="text-red-600 font-bold">{errorMessage}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
            <FormField label="Email" value={userInfo.email} readOnly />
            <FormField label="Full Name" name="fullName" value={data.fullName} onChange={handleChange} editable={isEditing} />
            <FormField label="Username" name="userName" value={data.userName} onChange={handleChange} editable={isEditing} />
            <FormField label="Gender" name="gender" value={data.gender} onChange={handleChange} editable={isEditing} type="select" options={genderOptions} />
            <FormField label="Birthday" name="birthday" value={isEditing ? toDateInputValue(data.birthday) : formatBirtday(data.birthday)} onChange={handleChange} editable={isEditing} type={isEditing ? "date" : "text"} />
            <FormField label="City" name="city" value={data.city} onChange={handleChange} editable={isEditing} type="select" options={provinceOptions} />

            <FormField label="Country" name="country" value={data.country} onChange={handleChange} readOnly />
            <FormField label="Description" name="description" value={data.description} onChange={handleChange} editable={isEditing} />
            <FormField label="Languages (comma separated)" name="languages" value={data.languages} onChange={handleChange} editable={isEditing} />
            <FormField label="Professions (comma separated)" name="professions" value={data.professions} onChange={handleChange} editable={isEditing} />
            <FormField label="Facebook Link" name="facebookLink" value={data.facebookLink} onChange={handleChange} editable={isEditing} />
            <FormField label="Telegram Link" name="telegramLink" value={data.telegramLink} onChange={handleChange} editable={isEditing} />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>

            {isEditing && (
              <button
                onClick={setProfile}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Profile
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function FormField({ label, value, name, onChange, editable = false, readOnly = false, type = "text", options = [] }) {
  return (
    <div>
      <label className="text-xs text-gray-500 block mb-1">{label}</label>
      {editable && !readOnly ? (
        type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="" disabled>Select {label}</option>
            {options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : type === "date" ? (
          <input
            type="date"
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        )
      ) : (
        <p className="font-medium">{value || "—"}</p>
      )}
    </div>
  );
}

