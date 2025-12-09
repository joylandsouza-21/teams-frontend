import { useEffect, useState } from "react";
import { X, Upload, Trash2, UserRound } from "lucide-react";
import { updateUser } from "../../api/user.api";
import { useAuth } from "../../store/auth.context";
import { toastError } from "../../utils/toast";

export default function ProfileEditModal({ onClose }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    if (auth?.user?.profile_pic) {
      setPreview(`${import.meta.env.VITE_API_BASE_URL}${auth.user.profile_pic}`);
      setFile(null);
    }
  }, [auth]);


  const handleFileChange = (e) => {
    const img = e.target.files[0];
    if (!img) return;

    setFile(img);
    setPreview(URL.createObjectURL(img));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      if (file) {
        formData.append("profile_pic", file);
      }

      if (!file && preview === null) {
        formData.append("remove_photo", "true");
      }

      const res = await updateUser({
        token: auth?.token,
        formData
      })

      if(res?.status !== 200) {
          toastError("Update failed");
      return;
    }

      const updatedUser = {
      ...auth.user,
      profile_pic: res?.data?.user?.profile_pic,
    };

    setAuth((prev) => ({
      ...prev,
      user: updatedUser,
    }));

    localStorage.setItem(
      "userData",
      JSON.stringify({
        ...auth,
        user: updatedUser,
      })
    );

    onClose();
  } catch (error) {
    console.error(error);
    toastError(error?.response?.data?.message || "Something went wrong");
  }
};


const handleRemove = () => {
  setFile(null);
  setPreview(null);
};

return (
  // ✅ BACKDROP — click here closes modal
  <div
    onClick={onClose}
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
  >
    {/* ✅ MODAL — click inside should NOT close */}
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-[#2b2b2b] text-white w-[380px] rounded-xl p-6 relative shadow-xl"
    >
      {/* ✅ Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">Profile picture</h2>
        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* ✅ Profile Image */}
      <div className="flex justify-center mb-6">
        <div className="w-36 h-36 rounded-full bg-gray-500 overflow-hidden flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserRound size={74} />
          )}
        </div>
      </div>

      {/* ✅ Actions (Upload + Remove) */}
      <div className="flex justify-center gap-6 mb-6">
        <label className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-lg hover:bg-white/10">
          <Upload size={16} />
          Upload
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </label>

        <button
          onClick={handleRemove}
          className="flex items-center gap-2 opacity-70 hover:opacity-100"
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>

      {/* ✅ Footer */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg hover:bg-white/10"
        >
          Close
        </button>

        <button
          onClick={handleSave}
          // disabled={!file}
          className={`px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700`}
        >
          Save
        </button>
      </div>
    </div>
  </div>
);
}
