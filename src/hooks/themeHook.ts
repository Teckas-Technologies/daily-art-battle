import { useState } from 'react';

export interface ThemeData {
  _id?: string;  
  month: string;
  week: string;
  holidayInspiredTheme: string;
  artisticStyleMovement: string;
  controversialTopic: string;
}

export const useSaveTheme = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const saveTheme = async (data: ThemeData[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const dataRes = await response.json();
      return dataRes.data;
    } catch (err) {
      console.error('Error saving theme:', err);
      setError("Error saving theme!");
    } finally {
      setLoading(false);
    }
  };

  return { saveTheme, loading, error };
};


export const useFetchTheme = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fethcedTheme = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/theme');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const dataRes = await response.json();
      return dataRes.data;
    } catch (err) {
      console.error('Error fetch theme:', err);
      setError("Error fetch theme!");
    } finally {
      setLoading(false);
    }
  };

  const fethcedThemeById = async (id:any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/theme?queryType=Today&week=${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const dataRes = await response.json();
      return dataRes.data;
    } catch (err) {
      console.error('Error fetch theme:', err);
      setError("Error fetch theme!");
    } finally {
      setLoading(false);
    }
  };

  const deleteTheme = async (id:any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/theme?id=${id}`,{
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return true;
    } catch (err) {
      console.error('Error delete theme:', err);
      setError("Error delete theme!");
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = async (id:any,data:ThemeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/theme?id=${id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return true;
    } catch (err) {
      console.error('Error delete theme:', err);
      setError("Error delete theme!");
    } finally {
      setLoading(false);
    }
  };

  return { fethcedTheme,deleteTheme,updateTheme,fethcedThemeById, loading, error };
};


