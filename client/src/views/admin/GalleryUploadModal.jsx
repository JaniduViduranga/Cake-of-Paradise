import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';

const CATEGORIES = ['Standard', 'Birthday', 'Wedding Cake', 'Cupcake', 'Custom'];

export default function GalleryUploadModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Standard');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    setError('');
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setError('');
      setFile(droppedFile);
      const objectUrl = URL.createObjectURL(droppedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const resetForm = () => {
    setTitle('');
    setCategory('Standard');
    setDescription('');
    setFile(null);
    setPreviewUrl('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a title for the cake design.');
      return;
    }

    if (!file) {
      setError('Please choose an image file to upload.');
      return;
    }

    setLoading(true);

    try {
      // Step 4 Requirement: Append fields to a FormData object
      // and send POST /api/gallery/upload without manually setting Content-Type
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      if (description.trim()) {
        formData.append('description', description.trim());
      }
      formData.append('image', file);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/gallery/upload`, {
        method: 'POST',
        // Do NOT manually set Content-Type header so the browser sets boundary
        body: formData,
      });

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseErr) {
        console.error('[GalleryUploadModal] Non-JSON response:', responseText);
        throw new Error(
          response.ok
            ? 'Invalid server response format.'
            : `Server responded with ${response.status}: ${response.statusText || 'Upload failed'}. Please ensure the backend server is running.`
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to upload image to Cloudinary.');
      }

      resetForm();
      if (typeof onSuccess === 'function') {
        onSuccess(result.image || result.data);
      }
      onClose();
    } catch (err) {
      console.error('[GalleryUploadModal] Upload error:', err);
      setError(err.message || 'An error occurred during upload. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-brand-surface border border-brand-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-bg-hero/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary">
              <Upload size={18} />
            </div>
            <div>
              <h2 className="font-playfair font-bold text-lg text-brand-text-dark">
                Upload Cake to Gallery
              </h2>
              <p className="text-xs text-brand-text-muted">
                Cloud-backed persistence via Cloudinary
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-brand-text-muted hover:text-brand-text-dark hover:bg-brand-bg-hero transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block font-montserrat text-xs font-semibold text-brand-text-dark mb-1.5 uppercase tracking-wide">
              Cake Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={loading}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 3-Tier Floral Ribbon Wedding Cake"
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-text-dark text-sm placeholder:text-brand-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition disabled:opacity-60"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-montserrat text-xs font-semibold text-brand-text-dark mb-1.5 uppercase tracking-wide">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              disabled={loading}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-white text-brand-text-dark text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition disabled:opacity-60"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block font-montserrat text-xs font-semibold text-brand-text-dark mb-1.5 uppercase tracking-wide">
              Description <span className="text-brand-text-muted font-normal lowercase">(optional)</span>
            </label>
            <textarea
              rows={2}
              disabled={loading}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the artisan techniques, layers, or styling inspiration..."
              className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-white text-brand-text-dark text-sm placeholder:text-brand-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition disabled:opacity-60 resize-none"
            />
          </div>

          {/* File Upload Dropzone */}
          <div>
            <label className="block font-montserrat text-xs font-semibold text-brand-text-dark mb-1.5 uppercase tracking-wide">
              Cake Image File <span className="text-red-500">*</span>
            </label>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
                previewUrl
                  ? 'border-brand-accent/50 bg-brand-bg-hero/30'
                  : 'border-brand-border hover:border-brand-primary bg-brand-bg-hero/10 hover:bg-brand-bg-hero/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                disabled={loading}
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="space-y-3">
                  <div className="relative inline-block mx-auto max-h-48 rounded-lg overflow-hidden border border-brand-border shadow-sm">
                    <img
                      src={previewUrl}
                      alt="Selected preview"
                      className="max-h-48 w-auto object-contain block mx-auto"
                    />
                  </div>
                  <p className="text-xs text-brand-accent font-medium">
                    Click or drag a new image to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-2 py-3">
                  <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto">
                    <ImageIcon size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-text-dark">
                      Click to choose photo or drag &amp; drop
                    </p>
                    <p className="text-xs text-brand-text-muted mt-0.5">
                      JPG, PNG, WEBP up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-brand-border-btn text-brand-accent hover:bg-brand-bg-hero text-sm font-semibold transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 text-sm px-6 py-2.5 rounded-xl disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading to Cloudinary...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload &amp; Publish
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

