"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useSaveTheme, ThemeData, useFetchTheme } from "@/hooks/themeHook";
import { useMbWallet } from "@mintbase-js/react";

const FileUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { saveTheme } = useSaveTheme();
  const { fethcedTheme, deleteTheme ,updateTheme} = useFetchTheme();
  const [parsedData, setParsedData] = useState<ThemeData[]>([]);
  const [resData, setResData] = useState<ThemeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [editData, setEditData] = useState<ThemeData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { isConnected, connect, activeAccountId } = useMbWallet();

  useEffect(() => {
    
    const fetch = async () => {
      const res = await fethcedTheme();
      setResData(res);
    };
    fetch();
    setReload(false);
  }, [reload]);

  const handleEdit = (data: ThemeData) => {
    setEditData(data);
    setShowModal(true);
  };

  const handleDelete = async (id: any) => {
    await deleteTheme(id);
    setReload(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      readExcelFile(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (parsedData.length > 0) {
      try {
        const res = await saveTheme(parsedData);
        setReload(true);
        setLoading(false);
        clearFile();
        console.log("Data saved successfully");
      } catch (err) {
        console.log("Failed to save data");
      }
    }
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if(editData){
      const res = await updateTheme(editData?._id,editData);
    }
    setShowModal(false);
    setEditData(null);
    setReload(true);
  };

  const readExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (jsonData.length > 0) {
        const [headers, ...rows] = jsonData;
        const expectedHeaders = [
          "Month",
          "Week",
          "Holiday-Inspired Theme",
          "Artistic Style/Movement",
          "Controversial Topic",
        ];
        const isValid = expectedHeaders.every(
          (header, index) => header === headers[index]
        );

        if (isValid) {
          const formattedData: ThemeData[] = rows.map((row) => {
            return {
              month: row[0] ?? "",
              week: row[1] ?? "",
              holidayInspiredTheme: row[2] ?? "",
              artisticStyleMovement: row[3] ?? "",
              controversialTopic: row[4] ?? "",
            };
          });
          setParsedData(formattedData);
          console.log("Formatted Data:", formattedData);
        } else {
          console.error("Invalid Excel file headers.");
        }
      }
    };
    reader.readAsBinaryString(file);
  };

  const clearFile = () => {
    setFile(null);
    const fileInput = document.getElementById("file") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  if(activeAccountId!=="scalability-vega.testnet"){
    return <div>
      Not allowed
    </div>
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <div className=" w-full bg-white">
          <form className="py-4 px-9" onSubmit={handleSubmit}>
            <div className="mb-6 pt-4">
              <label className="mb-5 block text-xl font-semibold text-[#07074D]">
                Upload File
              </label>

              <div className="mb-8">
                <input
                  type="file"
                  name="file"
                  id="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file"
                  className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                >
                  <div>
                    <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                      Drop files here
                    </span>
                    <span className="mb-2 block text-base font-medium text-[#6B7280]">
                      Or
                    </span>
                    <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                      Browse
                    </span>
                  </div>
                </label>
              </div>

              {file && (
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
              )}
            </div>

            <div>
              <button
                type="submit"
                className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
              >
                {loading ? `Submitting...` : `Submit`}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-5 ml-[100px] mr-[100px] relative overflow-x-auto shadow-md sm:rounded-lg">
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
          <tbody>
            {resData.map((row, index) => (
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
            ))}
          </tbody>
        </table>
      </div>

      {showModal && editData && (
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
      )}
    </>
  );
};

export default FileUploadForm;
