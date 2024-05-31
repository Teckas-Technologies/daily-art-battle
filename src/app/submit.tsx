"use client"
import type { NextPage } from 'next';
import { useState } from 'react';

const Submit: NextPage = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files ? event.target.files[0] : null);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) return;
        console.log('Submitting artwork...');
        // Implement submission logic here, possibly uploading to Mintbase
    };

    return (
        <main className="flex flex-col items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                <input type="file" onChange={handleFileChange} />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit Artwork</button>
            </form>
        </main>
    );
};

export default Submit;
