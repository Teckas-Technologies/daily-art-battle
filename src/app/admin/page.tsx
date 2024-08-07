"use client";
import { useFetchCampaignByTitle } from "@/hooks/campaignHooks";
import React, { useEffect, useState } from "react";

const Admin: React.FC = () => {
  const [formData, setFormData] = useState({
    campaignTitle: "",
    campaignTheme: "",
    campaignWelcomeText: "",
  });
  const{saveCampaign}=useFetchCampaignByTitle();

  // Handle input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await saveCampaign(formData);
console.log(res);
if(res.success){
  setFormData({
    campaignTitle: "",
    campaignTheme: "",
    campaignWelcomeText: "",
  });
}
  };
  return (
    <>
      <div className="flex items-center justify-center">
        <div className=" w-full bg-white">
        <form className="py-4 px-9" onSubmit={handleSubmit}>
            <div className="mb-6 pt-4">
              <label className="mb-5 block text-xl font-semibold text-[#07074D]">
                Create campaign
              </label>
              <div className="mb-5">
                <label htmlFor="campaignTitle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Campaign Title
                </label>
                <input
                  type="text"
                  id="campaignTitle"
                  value={formData.campaignTitle}
                  onChange={handleChange}
                  required
                  className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="mb-5">
                <label htmlFor="campaignTheme" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Theme Title
                </label>
                <input
                  type="text"
                  id="campaignTheme"
                  value={formData.campaignTheme}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="campaignWelcomeText" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Welcome Text
                </label>
                <input
                  type="text"
                  id="campaignWelcomeText"
                  value={formData.campaignWelcomeText}
                  onChange={handleChange}
                  required
                  className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* <div className="mt-5 ml-[100px] mr-[100px] relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Month
              </th>
              <th scope="col" className="px-6 py-3">
                Week
              </th>
              <th scope="col" className="px-6 py-3">
                Holiday-Inspired Theme
              </th>
              <th scope="col" className="px-6 py-3">
                Artistic Style/Movement
              </th>
              <th scope="col" className="px-6 py-3">
                Controversial Topic
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody> */}
            {/* {resData.map((row, index) => (
              <tr
                key={index}
                className={`border-b dark:border-gray-700 ${
                  index % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                }`}
              >
                <td className="px-6 py-4">{row.month}</td>
                <td className="px-6 py-4">{row.week}</td>
                <td className="px-6 py-4">{row.holidayInspiredTheme}</td>
                <td className="px-6 py-4">{row.artisticStyleMovement}</td>
                <td className="px-6 py-4">{row.controversialTopic}</td>
                <td className="px-6 py-4">
                  <a
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                    onClick={() => handleEdit(row)}
                  >
                    Edit
                  </a>
                  <a
                    onClick={() => handleDelete(row._id)}
                    className="cursor-pointer ml-2 font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))} */} 
          {/* </tbody>
        </table>
      </div> */}

      {/* {showModal && editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl mb-4">Edit Theme Data</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Month</label>
                <input
                  type="text"
                  value={editData.month}
                  onChange={(e) =>
                    setEditData({ ...editData, month: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Week</label>
                <input
                  type="text"
                  value={editData.week}
                  onChange={(e) =>
                    setEditData({ ...editData, week: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Holiday-Inspired Theme
                </label>
                <input
                  type="text"
                  value={editData.holidayInspiredTheme}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      holidayInspiredTheme: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Artistic Style/Movement
                </label>
                <input
                  type="text"
                  value={editData.artisticStyleMovement}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      artisticStyleMovement: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Controversial Topic
                </label>
                <input
                  type="text"
                  value={editData.controversialTopic}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      controversialTopic: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 mr-2 border rounded bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border rounded bg-blue-600 text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </>
  );
};

export default Admin;