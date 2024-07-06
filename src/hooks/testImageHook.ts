import { useState, useEffect } from 'react';

export const useFetchImage = () => {
  const [image, setImage] = useState<File | null>(null);

  const fetchImage = async (imageData: string, logoData: string) => {
    try {
      const response = await fetch('/api/testphoto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageData,
          logoData: logoData
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const file = new File([blob], 'processed_image.jpg', { type: 'image/jpeg' });
      setImage(file);
      return file;
    } catch (err) {
      console.log(err);
    }
  };

  return { image, fetchImage };
}
