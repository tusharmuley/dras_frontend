import { getUser } from "../utils/auth";

function Profile() {
  const user = getUser();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <p className="text-gray-900">{user?.username || "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-gray-900">{user?.email || "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <p className="text-gray-900">
              {user?.first_name || ""} {user?.last_name || ""}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID
            </label>
            <p className="text-gray-900">{user?.employee_id || "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <p className="text-gray-900 capitalize">{user?.role || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

