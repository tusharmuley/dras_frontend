import { useEffect, useState } from "react";
import { getUser, setUser } from "../utils/auth";
import { getUserProfile, updateUserProfile } from "../services/documentService";

function Profile() {
  const cachedUser = getUser();
  const [user, setUserState] = useState(cachedUser);
  const [formValues, setFormValues] = useState({
    id: cachedUser?.id || "",
    username: cachedUser?.username || "",
    email: cachedUser?.email || "",
    first_name: cachedUser?.first_name || "",
    last_name: cachedUser?.last_name || "",
    employee_id: cachedUser?.employee_id || "",
    blood_group: cachedUser?.blood_group || "",
    date_of_birth: cachedUser?.date_of_birth || "",
    date_of_joining: cachedUser?.date_of_joining || "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getUserProfile();
        const data = res.data?.data;
        if (data) {
          setUserState(data);
          setUser(data);
          setFormValues({
            id: data.id,
            username: data.username || "",
            email: data.email || "",
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            employee_id: data.employee_id || "",
            blood_group: data.blood_group || "",
            date_of_birth: data.date_of_birth || "",
            date_of_joining: data.date_of_joining || "",
          });
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formValues.id) {
      setError("User ID is missing. Please log in again.");
      return;
    }

    if (!formValues.username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!formValues.email.trim()) {
      setError("Email is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: formValues.id,
        username: formValues.username.trim(),
        email: formValues.email.trim(),
        first_name: formValues.first_name.trim(),
        last_name: formValues.last_name.trim(),
        employee_id: formValues.employee_id.trim(),
        blood_group: formValues.blood_group.trim(),
        date_of_birth: formValues.date_of_birth,
        date_of_joining: formValues.date_of_joining,
      };

      const res = await updateUserProfile(payload);
      const updatedUser = res.data?.data || user;
      setUser(updatedUser);
      setUserState(updatedUser);
      setSuccess("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      const apiMessage = err.response?.data?.message;
      const serializerErrors = err.response?.data?.errors;
      let message = apiMessage || "Failed to update profile.";

      if (serializerErrors && typeof serializerErrors === "object") {
        const firstKey = Object.keys(serializerErrors)[0];
        const firstError = serializerErrors[firstKey]?.[0];
        if (firstError) {
          message = `${firstKey}: ${firstError}`;
        }
      }

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-xl">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-xl">
        {(error || success) && (
          <div className="mb-4 space-y-2">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                {success}
              </div>
            )}
          </div>
        )}

        {!isEditing ? (
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
                {(user?.first_name || "") + " " + (user?.last_name || "")}
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
                Blood Group
              </label>
              <p className="text-gray-900">{user?.blood_group || "N/A"}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <p className="text-gray-900">
                  {user?.date_of_birth || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Joining
                </label>
                <p className="text-gray-900">
                  {user?.date_of_joining || "N/A"}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <p className="text-gray-900 capitalize">
                {user?.role || "N/A"}
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setFormValues({
                    id: user?.id,
                    username: user?.username || "",
                    email: user?.email || "",
                    first_name: user?.first_name || "",
                    last_name: user?.last_name || "",
                    employee_id: user?.employee_id || "",
                    blood_group: user?.blood_group || "",
                    date_of_birth: user?.date_of_birth || "",
                    date_of_joining: user?.date_of_joining || "",
                  });
                  setError("");
                  setSuccess("");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formValues.first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formValues.last_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID
              </label>
              <input
                type="text"
                name="employee_id"
                value={formValues.employee_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group
              </label>
              <input
                type="text"
                name="blood_group"
                value={formValues.blood_group}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formValues.date_of_birth || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Joining
                </label>
                <input
                  type="date"
                  name="date_of_joining"
                  value={formValues.date_of_joining || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <p className="text-gray-900 capitalize">
                {user?.role || "N/A"}
              </p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setError("");
                  setSuccess("");
                  setFormValues({
                    id: user?.id,
                    username: user?.username || "",
                    email: user?.email || "",
                    first_name: user?.first_name || "",
                    last_name: user?.last_name || "",
                    employee_id: user?.employee_id || "",
                    blood_group: user?.blood_group || "",
                    date_of_birth: user?.date_of_birth || "",
                    date_of_joining: user?.date_of_joining || "",
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;

