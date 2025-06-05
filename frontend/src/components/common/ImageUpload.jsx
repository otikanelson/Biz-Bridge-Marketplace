import React, { useState } from 'react';

const ImageUpload = ({ 
  initialImage, 
  onImageChange, 
  label = "Upload Image", 
  className = "",
  previewClassName = "w-32 h-32"
}) => {
  const [preview, setPreview] = useState(initialImage || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      onImageChange(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={className}>
      <div className="flex items-center space-x-4">
        <div className={`border-2 border-gray-300 rounded-lg overflow-hidden ${previewClassName}`}>
          {preview ? (
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <label 
            htmlFor="image-upload" 
            className="block bg-red-500 text-white text-center py-2 px-4 rounded cursor-pointer hover:bg-red-600 transition"
          >
            {preview ? 'Change Image' : label}
          </label>
          <input
            type="file"
            id="image-upload"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;