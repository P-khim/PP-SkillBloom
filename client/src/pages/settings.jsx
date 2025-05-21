import Sidebar from "../components/Sidebar";
import ProfileForm from "../components/ProfileForm";

export default function Settings() {
  return (
    <div className="relative min-h-screen flex justify-center items-center py-32 overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <img
          src="/business.jpg"
          alt="Background"
          className="w-full h-full object-cover object-center blur-sm opacity-30"
        />
      </div>

      <div className="relative z-10 flex w-[90%] max-w-6xl bg-white bg-opacity-90 rounded-2xl shadow-lg overflow-hidden">
        <Sidebar />
        <ProfileForm />
      </div>
    </div>
  );
}
