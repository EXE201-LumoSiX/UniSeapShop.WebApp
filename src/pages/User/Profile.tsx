import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  CreditCard as Edit3,
  Camera,
  Mail,
  Phone,
} from "lucide-react";
import api from "../../config/axios";

interface UserProfile {
  userId: string;
  username: string;
  email: string;
  phoneNumber: string;
  userImage: string;
  roleName: string | null;
  location?: string;
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    phoneNumber: "",
    location: "",
  });

  useEffect(() => {
    const getUserProfile = async () => {
      setIsLoading(true);
      try {
        const profileData = await fetchUserProfile();
        setUserProfile(profileData);

        // Initialize edit data with user profile data
        setEditData({
          username: profileData.username || "",
          phoneNumber: profileData.phoneNumber || "",
          location: profileData.location || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    getUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.get("api/User/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.isSuccess) {
        return response.data.value.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch user profile"
        );
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Get user ID from localStorage or from the userProfile state
      const userId = userProfile?.userId;
      if (!userId) {
        throw new Error("User ID not found");
      }

      // Prepare update data
      const updateData = {
        fullName: editData.username,
        phoneNumber: editData.phoneNumber,
        userImage: userProfile?.userImage || "",
        // Only include password if you're updating it, otherwise leave it empty
        // password: "" // Leave this out if not updating password
      };

      // Call API to update profile by ID
      const response = await api.put(`api/User/${userId}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.isSuccess) {
        // Update local user profile data
        setUserProfile((prev) =>
          prev
            ? {
                ...prev,
                username: editData.username,
                phoneNumber: editData.phoneNumber,
                location: editData.location,
              }
            : null
        );

        setIsEditing(false);
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      setError(
        error.response?.data?.error?.message ||
          "Không thể cập nhật thông tin người dùng. Vui lòng thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Get user ID from userProfile state
      const userId = userProfile?.userId;
      if (!userId) {
        throw new Error("User ID not found");
      }

      // Convert image to base64
      const base64Image = await convertFileToBase64(file);

      // Prepare update data with the new image
      const updateData = {
        fullName: userProfile?.username || "",
        phoneNumber: userProfile?.phoneNumber || "",
        userImage: base64Image,
        // Don't include password as we're not updating it
      };

      // Call API to update profile with new image
      const response = await api.put(`api/User/${userId}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.isSuccess) {
        // Update avatar in user profile
        setUserProfile((prev) =>
          prev
            ? {
                ...prev,
                userImage: base64Image,
              }
            : null
        );
      } else {
        throw new Error(response.data.message || "Failed to upload avatar");
      }
    } catch (error) {
      setError(
        error.response?.data?.error?.message ||
          "Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // If loading, show loading state
  if (isLoading && !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
          <p className="mt-4 text-amber-800">
            Đang tải thông tin người dùng...
          </p>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error && !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Đã xảy ra lỗi</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img
                src={
                  userProfile?.userImage ||
                  "https://via.placeholder.com/150?text=User"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-yellow-100"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-yellow-500 rounded-full p-2 cursor-pointer shadow-md hover:bg-yellow-600 transition-colors">
                  <Camera className="h-5 w-5 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {userProfile?.username || "Người dùng"}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {userProfile?.email || "Email chưa cập nhật"}
                  </span>
                </div>
                {userProfile?.phoneNumber && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    <span className="text-sm">{userProfile.phoneNumber}</span>
                  </div>
                )}
                {userProfile?.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{userProfile.location}</span>
                  </div>
                )}
              </div>
              {userProfile?.roleName && (
                <div className="mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      userProfile.roleName === "Admin"
                        ? "bg-red-100 text-red-800"
                        : userProfile.roleName === "Supplier"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {userProfile.roleName}
                  </span>
                </div>
              )}
              <div className="mt-4">
                {!isEditing ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto"
                    >
                      Chỉnh sửa hồ sơ
                    </button>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center w-full sm:w-auto">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Đổi mật khẩu
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleEditSubmit}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Lưu thay đổi
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chỉnh sửa thông tin cá nhân
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="username"
                  value={editData.username}
                  onChange={(e) =>
                    setEditData({ ...editData, username: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={editData.phoneNumber}
                  onChange={(e) =>
                    setEditData({ ...editData, phoneNumber: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Địa chỉ
                </label>
                <input
                  type="text"
                  id="location"
                  value={editData.location}
                  onChange={(e) =>
                    setEditData({ ...editData, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-500 mb-2">
                  * Email không thể thay đổi. Vui lòng liên hệ hỗ trợ nếu bạn
                  cần cập nhật email.
                </p>
              </div>
            </form>
          </div>
        )}

        {/* User Information */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-500" />
            Thông tin tài khoản
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Họ và tên:</span>
                <p className="font-medium text-gray-900">
                  {userProfile?.username}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="font-medium text-gray-900">
                  {userProfile?.email}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Số điện thoại:</span>
                <p className="font-medium text-gray-900">
                  {userProfile?.phoneNumber || "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Địa chỉ:</span>
                <p className="font-medium text-gray-900">
                  {userProfile?.location || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
