"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import "./ArtUploadForm.css";
import InlineSVG from "react-inlinesvg";
import { uploadFile, uploadReference } from "@mintbase-js/storage";
import { useMbWallet } from "@mintbase-js/react";
import { useSaveData, ArtData } from "@/hooks/artHooks";
import { Button } from "../ui/button";
import { useFetchImage } from "@/hooks/testImageHook";
import Badge from "../../public/images/badge.png";
import { useFetchGeneratedImage } from "@/hooks/generateImageHook";
import Toast from "../Toast";
import campaign from "../../../model/campaign";
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
}

const ArtUploadForm: React.FC<ArtUploadFormProps> = ({
  campaignId,
  onClose,
  onSuccessUpload,
}) => {
  const defaultArtworks: Artwork[] = [
    { name: "Select file", file: null, fileName: "", previewUrl: "" },
  ];
  const [artworks, setArtworks] = useState<Artwork[]>(defaultArtworks);
  const [artTitle, setArtTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const { isConnected, connect, activeAccountId } = useMbWallet();
  const { saveData } = useSaveData();
  const [isFormValid, setIsFormValid] = useState(false);
  const { image, fetchImage } = useFetchImage();
  const [imageCreating, setImageCreating] = useState(false);
  const { imageUrl, file, fetchGeneratedImage, error } =
    useFetchGeneratedImage();
  const [prompt, setPrompt] = useState(false);
  const [choose, setFileChoosen] = useState(false);
  const [imageChoose, setImageChoosen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [disable, setDisable] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [toast, setToast] = useState(true);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
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
    newArtworks[0] = { ...newArtworks[0], previewUrl: null };
    setArtworks(newArtworks);
    setPrompt(true);
    setMessage("");
  };

  const handleCreate = async (event: React.MouseEvent) => {
    event.preventDefault();
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
      setPrompt(false);
      setImageCreating(false);
    } else {
      console.error("error");
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
    if (!isConnected || !activeAccountId) {
      connect();
      return;
    }
    setUploading(true);

    try {
      const artBattle: Partial<ArtData> = { artistId: activeAccountId };
      if (artworks.length < 1) {
        alert("Please Upload All files");
        return;
      }

      artBattle.arttitle = artTitle;

      for (const artwork of artworks) {
        if (!artwork.file) {
          alert(`Missing file for ${artwork.name}`);
          return;
        }
        if (artwork.file.size > 30000000) {
          setToastMessage(`The file size should be less than 30 MB`);
          setToast(false);
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
            artBattle.colouredArt = url;
            artBattle.colouredArtReference = referenceUrl;
            break;
          // case 'Upload Derivative Edition':
          //   artBattle.grayScale = url;
          //   artBattle.grayScaleReference = referenceUrl;
          //     break;
          default:
            break;
        }
      }
      artBattle.campaignId = campaignId;
      await saveData(artBattle as ArtData);
      setToastMessage("All files uploaded successfully");
      setToast(true);
      onSuccessUpload();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files. Please check the files and try again.");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="Art-popupContainer">
      <div className="Art-popup ">
        <form onSubmit={uploadArtWork}>
          <button className="closeBtn" onClick={onClose}>
            <InlineSVG src="/icons/x.svg" />
          </button>
          <div className="Art-popup-header">
            <h2>Upload Art</h2>
          </div>

          {artworks.map((artwork, index) => (
            <div className="content" key={index}>
              <div className="uploadSection">
                <div className="fileInput">
                  {artwork.previewUrl && !isAiGenerated ? (
                    <img
                      src={artwork.previewUrl}
                      alt="Selected Preview"
                      className="file-preview"
                    />
                  ) : (
                    <span>{artwork.fileName}</span>
                  )}

                  <div className="selectfileWrapper">
                    {(!artwork.previewUrl || isAiGenerated) && (
                      <label htmlFor={`fileInput-${index}`} className="filebtn">
                        {artwork.name}
                      </label>
                    )}
                    <input
                      className={`hidden ${
                        disable ? "cursor-not-allowed" : ""
                      }`}
                      disabled={disable}
                      type="file"
                      id={`fileInput-${index}`}
                      onChange={handleFileChange(index)}
                    />
                  </div>
                </div>

                <div className="popup-description">
                  <h3>Add description</h3>
                  <textarea
                    className="descriptionInput"
                    placeholder="Enter text here"
                    onChange={handleArtName}
                  ></textarea>
                </div>
              </div>

              <div className="orSeparator">
                <InlineSVG src="/icons/line.svg" /> <span>or</span>{" "}
                <InlineSVG src="/icons/line.svg" />
              </div>

              {artwork.previewUrl && !imageChoose && isAiGenerated && (
                <div className="flex items-center justify-center AI-art">
                  <img
                    src={artwork.previewUrl}
                    alt="Preview"
                    className="w-[300px] h-[250px] rounded-[10px]"
                  />
                </div>
              )}

              <div className="generateSection">
                <button className="gfxButton">GFXs</button>
                <input
                  type="text"
                  placeholder="Enter prompt here"
                  value={message}
                  onChange={handleMessageChange}
                />
                <button className="generateButton" onClick={handleCreate}>
                  <div>
                    <InlineSVG src="/icons/blink.svg" />
                  </div>{" "}
                  Generate <InlineSVG src="/icons/coin.svg" /> <span>3</span>
                </button>
              </div>
            </div>
          ))}

          <div className="popup-bottom">
            <button className="cancelButton" onClick={onClose}>
              Cancel
            </button>
            <button
              className={`continueButton ${isFormValid ? "success" : ""}`}
              onClick={onSuccessUpload}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArtUploadForm;
