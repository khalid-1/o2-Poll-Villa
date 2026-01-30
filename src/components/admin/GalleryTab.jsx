import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export function GalleryTab({ darkMode }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 space-y-4">
            <div className={`p-4 rounded-full ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
                <ImageIcon className={`w-8 h-8 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
            </div>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-neutral-200' : 'text-neutral-900'}`}>
                Gallery Management
            </h3>
            <p className={`text-sm max-w-xs ${darkMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                Upload and organize villa photos. Coming soon.
            </p>
        </div>
    );
}
