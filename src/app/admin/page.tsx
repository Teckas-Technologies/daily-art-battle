"use client";
import React, { useEffect, useState } from "react";
import { useMbWallet } from "@mintbase-js/react";

const Admin: React.FC = () => {

  return (
    <>
      <div className="flex items-center justify-center">
        <div className=" w-full bg-white">
          <form className="py-4 px-9" >
            <div className="mb-6 pt-4">
              <label className="mb-5 block text-xl font-semibold text-[#07074D]">
               Create campaign
              </label>
              <div className="mb-5">
                <div>
                <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Campaign Title</label>
                <input type="text" id="small-input" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
            </div>
            <div className="mb-5">
                <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Theme title</label>
                <input type="text" id="base-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
            </div>
            <div>
                <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Welcome Text</label>
                <input type="text" id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                </div>
            </div>
            
              {/* {file && (
                <div className="mb-5 rounded-md bg-[#F5F7FB] py-4 px-8">
                  <div className="flex items-center justify-between">
                    <span className="truncate pr-3 text-base font-medium text-[#07074D]">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      className="text-[#07074D]"
                      onClick={clearFile}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                          fill="currentColor"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )} */}
            </div>

            <div>
              <button
                type="submit"
                className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
              >
                Submit
             
              </button>
            </div>
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