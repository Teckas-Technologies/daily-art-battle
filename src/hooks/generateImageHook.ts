import { useState } from 'react';

export const useFetchGeneratedImage = () => {
  const [imageUrl, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchGeneratedImage = async (prompt: string) => {
    try {
      setError(null);
      const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt
        }),
      });

      if (!response.ok) {
        setError('Failed to fetch the image. Please try again.');
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      let fetchedFile;
      setImage(data.imageUrl);
        if (data.imageBlob) {
          const base64String = data.imageBlob;
          const blob = base64ToBlob(base64String, 'image/png'); 
           fetchedFile = new File([blob], 'GeneratedImage.png', { type: 'image/png' });
          setFile(fetchedFile); 
        }
      return { imageUrl: data.imageUrl, file: fetchedFile};
    } catch (err) {
      console.error('Error fetching image:', err);
      setError('An error occurred while fetching the image.');
      return null;
    }
  };

  return { imageUrl, file, fetchGeneratedImage,error };
};

const base64ToBlob = (base64String: string, contentType: string): Blob => {
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};