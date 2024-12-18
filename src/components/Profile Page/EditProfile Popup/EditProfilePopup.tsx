"use client"
import useUpdateUserProfile from "@/hooks/updateProfileHook";
import React, { useState } from "react";
import InlineSVG from "react-inlinesvg";

interface EditProfilePopupProps {
  onClose: () => void;
}

const EditProfilePopup: React.FC<EditProfilePopupProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({ firstName: "", lastName: "" });
  const { updateProfile } = useUpdateUserProfile();
  const [loading, setLoading] = useState(false); 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName } = formData;
    if (!firstName || !lastName) {
      alert("Please fill in all fields.");
      return;
    }
    setLoading(true); 
    try {
      await updateProfile(firstName, lastName);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="w-[90%] md:w-[600px] bg-[#000000] rounded-2xl px-[20px] md:px-[40px] py-[20px] md:py-[40px] text-white relative"
        style={{ border: "1px solid #383838" }}
      >
        <button className="absolute top-4 right-4" onClick={onClose}>
          <InlineSVG src="/icons/x.svg" className="w-6 h-6 " />
        </button>

        <h2 className="text-center text-sm font-medium text-[#00FF00] mb-[40px] md:mb-[30px] md:text-xl md:font-semibold mt-[20px] md:mt-0">
          Edit Profile Details
        </h2>

        <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row items-start md:items-center md:space-y-0 space-y-1">
            <label
              htmlFor="twitter"
              className="text-sm font-semibold w-full md:w-[230px] text-left"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-full bg-transparent text-white focus:outline-none"
              style={{ border: "0.61px solid #B5B5B5" }}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center md:space-y-0 space-y-1">
            <label
              htmlFor="instagram"
              className="text-sm font-semibold w-full md:w-[230px] text-left"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-full bg-transparent text-white focus:outline-none"
              style={{ border: "0.61px solid #B5B5B5" }}
            />
          </div>
          <div className="flex flex-row items-center justify-center gap-5 mt-4 md:mt-0 ">
            <button
              type="button"
              className="w-full md:w-auto px-4 md:px-8 py-3 md:py-3 rounded-full font-semibold text-[#00FF00] text-xs md:text-base"
              onClick={onClose}
              style={{ border: "0.61px solid #00FF00" }}
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="w-full md:w-auto px-4 md:px-8 py-3 md:py-3 rounded-full font-semibold bg-[#AAAAAA] text-[#FFFFFF] text-xs md:text-base transition duration-300 ease-in-out hover:bg-[#888888] hover:text-[#00FF00]"
              style={{ border: "0.61px solid #00FF00" }}
            >
             {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePopup;
