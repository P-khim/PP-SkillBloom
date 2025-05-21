export default function ProfileForm() {
  return (
    <div className="w-full md:w-3/4 bg-white p-8 rounded-r-2xl shadow-md">
      <h2 className="text-lg font-semibold text-red-500 mb-6">
        Account settings
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div className="space-y-4">
          <Input
            label="Username"
            defaultValue="Jessie Lane"
            description="This will be visible to other users."
          />
          <Input
            label="Email"
            defaultValue="jessieLane@gmail.com"
            description="We'll never share your email with anyone else."
          />
          <Select
            label="Gender"
            options={["Female", "Male"]}
            description="Used for personalization and analytics."
          />
          <div>
            <label className="block mb-1 font-medium">Birthday</label>
            <div className="flex gap-2">
              <Select options={["12"]} />
              <Select options={["October"]} />
              <Select options={["1992"]} />
            </div>
          </div>
          <Input
            label="Job"
            defaultValue="UI designer, writer"
            description="What do you do for a living?"
          />
          <Select
            label="Language"
            options={["English"]}
            description="Used for site content and communication."
          />
          <Select
            label="Country"
            options={["Cambodia"]}
            description="Select your country of residence."
          />
          <Select
            label="City"
            options={["Phnom Penh"]}
            description="Used to help personalize services and offers."
          />
        </div>

        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            description="Enter your current password to make changes."
          />
          <Input
            label="New Password"
            type="password"
            description="Must be at least 6 characters long."
          />
          <Input
            label="Confirm Password"
            type="password"
            description="Re-enter your new password for confirmation."
          />
          <Input
            label="Facebook link"
            defaultValue="example@gmail.com"
            description="Optional social profile link."
          />
          <Input
            label="Twitter link"
            defaultValue="example@gmail.com"
            description="Optional social profile link."
          />

          <button className="bg-red-500 text-white px-6 py-2 rounded-md mt-4">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, defaultValue = "", type = "text", description = "" }) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full border rounded px-3 py-2"
      />
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
}

function Select({ label, options = [], description = "" }) {
  return (
    <div>
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <select className="w-full border rounded px-3 py-2">
        {options.map((opt, idx) => (
          <option key={idx}>{opt}</option>
        ))}
      </select>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
}

function Toggle({ label, defaultChecked = false }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="toggle toggle-red"
      />
    </div>
  );
}
