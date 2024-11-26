"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import "./ArtUploadForm.css";
import InlineSVG from "react-inlinesvg";
import { uploadFile, uploadReference } from "@mintbase-js/storage";
import { useSaveData, ArtData } from "@/hooks/artHooks";
import { useFetchGeneratedImage } from "@/hooks/generateImageHook";
import { useAuth } from "@/contexts/AuthContext";
import { AI_IMAGE, ART_UPLOAD } from "@/config/points";
import { useRouter } from "next/navigation";

interface Artwork {
  name: string;
  file: File | null | undefined;
  fileName: string;
  previewUrl: string | null;
}

interface ArtUploadFormProps {
  campaignId: string;
  onClose: () => void;
  onSuccessUpload: () => void;
  setSignToast: (e: boolean) => void;
  setErrMsg: (e: string) => void;
  setToast: (e: boolean) => void;
  setSuccessToast: (e: string) => void;
  setToastMessage: (e: string) => void;
}

const ArtUploadForm: React.FC<ArtUploadFormProps> = ({
  campaignId,
  onClose,
  onSuccessUpload,
  setSignToast,
  setErrMsg,
  setToast,
  setSuccessToast,
  setToastMessage
}) => {
  const defaultArtworks: Artwork[] = [
    { name: "Select file", file: null, fileName: "", previewUrl: "" },
  ];
  const [artworks, setArtworks] = useState<Artwork[]>(defaultArtworks);
  const [artTitle, setArtTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const { saveData } = useSaveData();
  const [isFormValid, setIsFormValid] = useState(false);
  const [imageCreating, setImageCreating] = useState(false);
  const { imageUrl, file, fetchGeneratedImage, error } = useFetchGeneratedImage();
  const [prompt, setPrompt] = useState(false);
  const [choose, setFileChoosen] = useState(false);
  const [imageChoose, setImageChoosen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [disable, setDisable] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const router = useRouter();
  const { user, userTrigger, setUserTrigger } = useAuth();
  let userDetails = user;

  const handleFileChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      const newArtworks = [...artworks];

      if (file) {
        const previewUrl = URL.createObjectURL(file);
        newArtworks[index] = {
          ...newArtworks[index],
          file,
          fileName: file.name,
          previewUrl,
        };
        setIsAiGenerated(false);
      } else {
        newArtworks[index] = {
          ...newArtworks[index],
          file: null,
          fileName: "",
          previewUrl: null,
        };
      }
      setArtworks(newArtworks);
    };

  const handleArtName = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = e.target.value;
    setArtTitle(name);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    setImageError(false);
  };

  const handlePrompt = () => {
    const newArtworks = [...artworks];
    newArtworks[0] = {
      ...newArtworks[0],
      file: null,
      fileName: "",
      previewUrl: "",
    };
    setArtworks(newArtworks);
    console.log("prompt", artworks);

    setDisable(true);
    setMessage("");
    setPrompt(true);
  };

  const handleClosePrompt = (event: React.MouseEvent) => {
    setDisable(false);
    setImageError(false);
    event.preventDefault();
    setPrompt(false);
    setMessage("");
  };

  const handleCloseImage = (event: React.MouseEvent) => {
    event.preventDefault();
    const newArtworks = [...artworks];
    newArtworks[0] = { ...newArtworks[0], previewUrl: null, fileName: "", file: null };
    setArtworks(newArtworks);
    setPrompt(true);
    setMessage("");
  };

  const handleCreate = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (!message) {
      return;
    }

    if (!userDetails) {
      setSignToast(true);
      setErrMsg("Sign In to generate your Art!");
      return;
    }

    if (userDetails?.user?.gfxCoin < AI_IMAGE) {
      setToast(true);
      setSuccessToast("no");
      setToastMessage("Insufficient GFXvs Coin!");
      return;
    }

    setImageCreating(true);

    const res = await fetchGeneratedImage(message);
    if (res) {
      const newArtworks = [...artworks];
      newArtworks[0] = {
        ...newArtworks[0],
        previewUrl: res?.imageUrl,
        file: res.file,
      };
      setIsAiGenerated(true);
      setArtworks(newArtworks);
      setUserTrigger(!userTrigger);
      setPrompt(false);
      setImageCreating(false);
    } else {
      console.error("error");
      setUserTrigger(!userTrigger);
      setImageError(true);
      setImageCreating(false);
    }
  };

  const handleChoosenImage = async (event: React.MouseEvent) => {
    event.preventDefault();
    setDisable(false);
    setFileChoosen(true);
    setImageChoosen(true);

    const newArtworks = [...artworks];
    const previewUrl = newArtworks[0].previewUrl;

    if (!previewUrl) {
      console.error("No preview image URL available");
      return;
    }

    try {
      newArtworks[0] = { ...newArtworks[0], fileName: "Generated image" };
      setArtworks(newArtworks);
      setFileChoosen(false);
      setPrompt(false);
    } catch (error) {
      console.error("Error converting preview URL to file:", error);
    }
  };

  useEffect(() => {
    const isFirstFileUploaded = artworks[0]?.file !== null;
    setIsFormValid(isFirstFileUploaded && artTitle.trim() !== "");
  }, [artworks, artTitle]);

  const uploadArtWork = async (event: React.FormEvent) => {
    event.preventDefault();
    if (artworks[0].file === null) {
      return;
    }
    if (!artTitle) {
      return;
    }
    if (!userDetails) {
      setSignToast(true);
      setErrMsg("Sign In to upload your Art!");
      return;
    }

    if (userDetails?.user?.gfxCoin < ART_UPLOAD) {
      setToast(true);
      setSuccessToast("no");
      setToastMessage("Insufficient GFXvs Coin!");
      return;
    }

    setUploading(true);

    try {
      const artData: Partial<ArtData> = {};
      if (artworks.length < 1) {
        alert("Please Upload All files");
        return;
      }

      artData.arttitle = artTitle;
      artData.artistName = userDetails?.user?.firstName + " " + userDetails?.user?.lastName;
      console.log(artData.artistName)

      for (const artwork of artworks) {
        if (!artwork.file) {
          alert(`Missing file for ${artwork.name}`);
          return;
        }
        if (artwork.file.size > 30000000) {
          setToastMessage(`The file size should be less than 30 MB`);
          setToast(true);
          setSuccessToast("no");
          return;
        }
        console.log(artwork.file.size);
        const uploadResult = await uploadFile(artwork.file);
        const url = `https://arweave.net/${uploadResult.id}`;
        const metadata = {
          title: "Art Battle",
          media: artwork.file,
        };
        const referenceResult = await uploadReference(metadata);
        const referenceUrl = `https://arweave.net/${referenceResult.id}`;
        switch (artwork.name) {
          case "Select file":
            artData.colouredArt = url;
            artData.colouredArtReference = referenceUrl;
            break;
          // case 'Upload Derivative Edition':
          //   artBattle.grayScale = url;
          //   artBattle.grayScaleReference = referenceUrl;
          //     break;
          default:
            break;
        }
      }
      artData.campaignId = campaignId;
      console.log("ART DATA : ", artData)
      await saveData(artData);
      setUserTrigger(!userTrigger);
      setToastMessage("Art uploaded successfully");
      setToast(true);
      setSuccessToast("yes");
      onSuccessUpload();
      setTimeout(() => {
        onClose();
      }, 200);
    } catch (error) {
      setUserTrigger(!userTrigger);
      console.error("Error uploading files:", error);
      setToastMessage("Failed to upload your art!");
      setToast(true);
      setSuccessToast("no");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="Art-popupContainer px-3">
      <div className="Art-popup md:px-[3rem] md:py-[2rem] px-2 py-6 rounded-xl">
        <form onSubmit={uploadArtWork}>
          <button className="closeBtn right-5 md:right-[3rem]" onClick={onClose}>
            <InlineSVG src="/icons/x.svg" />
          </button>
          <div className="Art-popup-header">
            <h2>Upload Art</h2>
          </div>

          {artworks.map((artwork, index) => (
            <div className="content" key={index}>
              <div className="uploadSection pb-7 md:pb-2 flex md:flex-row flex-col justify-center md:items-start">
                <div className="fileInput relative md:w-[12rem] md:h-[12rem] w-[10rem] h-[10rem] rounded-xl">
                  {artwork.previewUrl && !isAiGenerated ? (
                    <>
                      <img
                        src={artwork.previewUrl}
                        alt="Selected Preview"
                        className="file-preview w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute bottom-0 w-full flex items-center justify-end px-2 pb-2">
                        {/* <div className="new-upload w-[2rem] h-[2rem] p-2 bg-white rounded-full">
                          <InlineSVG
                            src='/icons/reload.svg'
                            color='#000000'
                            className='fill-current w-4 h-4'
                          />
                        </div> */}
                        <div className="remove-upload w-[2rem] h-[2rem] p-1 bg-white rounded-full cursor-pointer" onClick={handleCloseImage}>
                          <InlineSVG
                            src='/icons/trash.svg'
                            color='#000000'
                            className='fill-current w-6 h-6'
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <span>{artwork.fileName}</span>
                  )}

                  <div className="selectfileWrapper absolute bottom-2">
                    {(!artwork.previewUrl || isAiGenerated) && (
                      <div className="file-outer">
                        <label htmlFor={`fileInput-${index}`} className="filebtn font-semibold md:text-md text-sm md:px-[1.5rem] md:py-[0.5rem] px-[1.5rem] py-[0.4rem] cursor-pointer">
                          {artwork.name}
                        </label>
                      </div>
                    )}
                    <input
                      className={`hidden ${disable ? "cursor-not-allowed" : ""
                        }`}
                      disabled={disable}
                      type="file"
                      id={`fileInput-${index}`}
                      onChange={handleFileChange(index)}
                    />
                  </div>
                </div>

                <div className="popup-description md:w-[20rem] md:h-[10.2rem] w-full h-[8.8rem]">
                  <h3>Add description</h3>
                  <textarea
                    className="descriptionInput h-full rounded-xl"
                    placeholder="Enter text here"
                    onChange={handleArtName}
                    maxLength={150}
                  ></textarea>
                </div>
              </div>

              <div className="orSeparator py-3">
                <InlineSVG src="/icons/line.svg" /> <span>or</span>{" "}
                <InlineSVG src="/icons/line.svg" />
              </div>

              {imageCreating && <div className="generating w-full flex justify-center mb-3">
                <div className="generating-img-holder flex items-center justify-center md:w-[10rem] md:h-[10rem] w-[8rem] h-[8rem] rounded-xl">
                  <InlineSVG
                    src="/icons/loading.svg"
                    className="fill-current w-10 h-10 animate-spin"
                  />
                </div>
              </div>}

              {artwork.previewUrl && !imageChoose && isAiGenerated && (
                <div className="flex items-center justify-center AI-art">
                  <div className="ai-image-holder relative  md:w-[10rem] md:h-[10rem] w-[8rem] h-[8rem] rounded-xl">
                    <img
                      src={artwork.previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute bottom-0 w-full flex items-center justify-end px-2 pb-2">
                      <div className="remove-upload w-[2rem] h-[2rem] p-1 bg-white rounded-full cursor-pointer" onClick={handleCloseImage}>
                        <InlineSVG
                          src='/icons/trash.svg'
                          color='#000000'
                          className='fill-current w-6 h-6'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="generateSection">
                <button className="gfxButton md:flex hidden md:py-[0.7rem] md:px-[2.5rem] py-[0.3rem] px-[1.5rem] md:text-sm text-xs">GFXvs</button>
                <input
                  type="text"
                  placeholder="Enter prompt here"
                  value={message}
                  className="ml-2 md:w-full w-full md:h-[3rem] h-[2rem] mr-3"
                  onChange={handleMessageChange}
                />
                <button className={`generateButton md:px-[1.2rem] md:py-[0.8rem] px-[1rem] py-[0.7rem] ${userDetails && userDetails?.user?.gfxCoin < AI_IMAGE && "red"}`} onClick={handleCreate}>
                  <div>
                    <InlineSVG src="/icons/blink.svg" color={`${userDetails && userDetails?.user?.gfxCoin < AI_IMAGE ? "#FF543E" : "#009900"}`} className="fill-current md:h-5 md:w-5 h-4 w-4" />
                  </div>{" "}
                  Generate <InlineSVG src="/icons/coin.svg" /> <span>1</span>
                </button>
              </div>
              {userDetails && userDetails?.user?.gfxCoin < AI_IMAGE && <div className="insuff w-full flex justify-end">
                <h2 className="text-[#FF543E] underline underline-offset-2 pr-4 text-sm font-semibold">Insufficient Coins? <span className="text-[#00FF00] underline underline-offset-2 cursor-pointer" onClick={() => router?.push("/profile?buyCoin=true")}>Purchase</span></h2>
              </div>}
            </div>
          ))}

          <div className="popup-bottom">
            <button className="cancelButton px-[2rem] py-[0.7rem]" onClick={onClose}>
              Cancel
            </button>
            <button
              className={`continueButton px-[2rem] py-[0.7rem] flex items-center gap-2 ${isFormValid ? "success" : ""}`}
              onClick={onSuccessUpload}
            >
              {uploading ? "Uploading..." : "Upload"}
              {uploading && <div role="status">
                <svg aria-hidden="true" className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>}
            </button>
          </div>
          {userDetails && userDetails?.user?.gfxCoin < ART_UPLOAD && <div className="insuff w-full flex justify-center">
            <h2 className="text-[#FF543E] underline underline-offset-2 pr-4 text-sm font-semibold pt-4">Insufficient Coins? <span className="text-[#00FF00] underline underline-offset-2 cursor-pointer" onClick={() => router?.push("/profile?buyCoin=true")}>Purchase</span></h2>
          </div>}
        </form>
      </div>
    </div>
  );
};

export default ArtUploadForm;
