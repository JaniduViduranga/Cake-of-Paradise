import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

export default function ImageUploader({ onUpload, preview, onClear }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => onUpload(e.target.result, file.name);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          <img src={preview} alt="Design reference" className="w-full h-48 object-cover" />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-chocolate-800/60 hover:text-red-500 shadow transition-colors"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-chocolate-900/60 to-transparent px-3 py-2">
            <p className="font-montserrat text-xs text-white truncate">Design reference uploaded</p>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragging
              ? 'border-caramel-600 bg-cream-100'
              : 'border-gray-200 bg-white hover:border-caramel-600/50 hover:bg-cream-50'
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          aria-label="Upload design reference image"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-cream-100 flex items-center justify-center">
              <Upload size={22} className="text-caramel-600" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-montserrat text-sm text-chocolate-800/70">
                Drag &amp; drop or{' '}
                <button
                  type="button"
                  className="text-caramel-600 font-semibold underline hover:text-caramel-700"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                >
                  browse
                </button>
              </p>
              <p className="font-montserrat text-xs text-chocolate-800/40 mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
        aria-label="Image upload input"
      />
    </div>
  );
}
