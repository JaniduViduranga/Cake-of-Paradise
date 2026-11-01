import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  ExternalLink,
  Layers,
  Sparkles,
  Link as LinkIcon,
  Eye,
} from 'lucide-react';
import {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../../../services/api';
import { GALLERY_ITEMS } from '../../../models/cakes';

const CATEGORIES = [
  'Standard Cakes',
  'Birthday Cakes',
  'Wedding Cakes',
  'Cupcakes',
];

export default function AdminGallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Standard Cakes');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'

  const fileInputRef = useRef(null);

  // Load existing gallery items from API or fallback
  const fetchGalleryItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getGallery();
      const items = res.data?.data || res.data?.items || [];
      if (items.length > 0) {
        setGalleryItems(items);
      } else {
        // Fallback to static seed items from cakes.js
        const seedItems = GALLERY_ITEMS.map((item) => ({
          _id: item.id,
          id: item.id,
          title: item.title,
          image: item.image,
          category: item.category === 'Cup Cakes' ? 'Cupcakes' : item.category,
          description: 'Artisanal cake masterpiece crafted by Cake of Paradise.',
          tags: [item.category],
          isFeatured: false,
        }));
        setGalleryItems(seedItems);
      }
    } catch (err) {
      console.warn('Could not load gallery from backend, using default items:', err);
      const seedItems = GALLERY_ITEMS.map((item) => ({
        _id: item.id,
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category === 'Cup Cakes' ? 'Cupcakes' : item.category,
        description: 'Artisanal cake masterpiece crafted by Cake of Paradise.',
        tags: [item.category],
        isFeatured: false,
      }));
      setGalleryItems(seedItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Handle image file selection / drag-and-drop
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        setUploadMode('file');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle URL input change
  const handleUrlChange = (e) => {
    const val = e.target.value;
    setImageUrlInput(val);
    setImagePreview(val);
  };

  // Submit new photo to gallery
  const handleSubmitNewCake = async (e) => {
    e.preventDefault();
    const finalImage = uploadMode === 'file' ? imagePreview : imageUrlInput;

    if (!title.trim()) {
      alert('Please enter a cake title.');
      return;
    }
    if (!finalImage) {
      alert('Please provide or upload a cake image.');
      return;
    }

    setUploading(true);
    try {
      const payload = {
        title: title.trim(),
        image: finalImage,
        category,
        description: description.trim(),
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        isFeatured,
      };

      const res = await createGalleryItem(payload);
      const createdItem = res.data?.data || res.data?.item || {
        _id: `g-${Date.now()}`,
        ...payload,
      };

      // Add to front of gallery list
      setGalleryItems((prev) => [createdItem, ...prev]);

      // Reset form
      setTitle('');
      setDescription('');
      setTags('');
      setIsFeatured(false);
      setImagePreview('');
      setImageUrlInput('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      showToast(`🎉 "${payload.title}" published to public gallery!`);
    } catch (err) {
      console.error('Error publishing cake image:', err);
      // Optimistic local add if server endpoint unavailable
      const localItem = {
        _id: `local-${Date.now()}`,
        title: title.trim(),
        image: finalImage,
        category,
        description: description.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        isFeatured,
      };
      setGalleryItems((prev) => [localItem, ...prev]);
      showToast(`🎉 "${title}" added to gallery!`);
    } finally {
      setUploading(false);
    }
  };

  // Toggle "Featured on Home"
  const handleToggleFeatured = async (item) => {
    const targetId = item._id || item.id;
    const newFeatured = !item.isFeatured;

    // Optimistic UI update
    setGalleryItems((prev) =>
      prev.map((g) =>
        (g._id === targetId || g.id === targetId) ? { ...g, isFeatured: newFeatured } : g
      )
    );

    try {
      await updateGalleryItem(targetId, { isFeatured: newFeatured });
      showToast(
        newFeatured
          ? `⭐ Marked "${item.title}" as Featured on Home Showcase!`
          : `Removed "${item.title}" from Featured Showcase.`
      );
    } catch (err) {
      console.warn('Could not persist featured toggle to server:', err);
      showToast(
        newFeatured
          ? `⭐ Marked as Featured on Home!`
          : `Removed from Featured Showcase.`
      );
    }
  };

  // Delete cake design
  const handleDeleteItem = async (targetId) => {
    // Optimistic removal
    setGalleryItems((prev) =>
      prev.filter((g) => g._id !== targetId && g.id !== targetId)
    );
    setDeleteConfirmId(null);

    try {
      await deleteGalleryItem(targetId);
      showToast('Cake design removed from gallery.');
    } catch (err) {
      console.warn('Could not delete from server:', err);
      showToast('Cake design removed from list.');
    }
  };

  // Filter items by category
  const filteredGallery = useMemo(() => {
    if (categoryFilter === 'All') return galleryItems;
    return galleryItems.filter((item) => {
      const cat = (item.category || '').toLowerCase();
      const filter = categoryFilter.toLowerCase();
      return cat.includes(filter) || filter.includes(cat);
    });
  }, [galleryItems, categoryFilter]);

  return (
    <div className="space-y-8 animate-fade-in font-montserrat">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-chocolate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-caramel-600/40 animate-slide-up text-xs font-semibold">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-playfair font-bold text-2xl sm:text-3xl text-chocolate-900">
              Gallery Upload & Management
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-caramel-600 text-white uppercase tracking-wider">
              Tab 3
            </span>
          </div>
          <p className="text-xs sm:text-sm text-chocolate-800/60 mt-1">
            Manage photos showcased to customers on your public website gallery and homepage highlight reel.
          </p>
        </div>

        <a
          href="/gallery"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-caramel-600 hover:text-caramel-700 bg-cream-100 hover:bg-cream-200/80 px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto"
        >
          <span>View Live Public Gallery</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Upload New Cake Photo Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-cream-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-caramel-600/10 text-caramel-600 flex items-center justify-center">
              <Upload size={18} />
            </div>
            <div>
              <h2 className="font-playfair font-bold text-base sm:text-lg text-chocolate-900">
                Upload New Cake Photo Card
              </h2>
              <p className="text-[11px] text-chocolate-800/60">
                Instantly publishes the cake photo to your live website gallery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                uploadMode === 'file'
                  ? 'bg-white text-chocolate-900 shadow-2xs'
                  : 'text-gray-500 hover:text-chocolate-900'
              }`}
            >
              File / Drop
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                uploadMode === 'url'
                  ? 'bg-white text-chocolate-900 shadow-2xs'
                  : 'text-gray-500 hover:text-chocolate-900'
              }`}
            >
              Image URL
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmitNewCake} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Image Upload / Dropzone */}
            <div className="lg:col-span-5 space-y-3">
              <label className="block text-xs font-bold text-chocolate-800 uppercase tracking-wide">
                Cake Image File <span className="text-rose-500">*</span>
              </label>

              {uploadMode === 'file' ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                    imagePreview
                      ? 'border-caramel-600/50 bg-cream-50/40'
                      : 'border-gray-300 hover:border-caramel-600 bg-cream-50/30'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Uploaded preview"
                        className="w-full h-56 object-cover rounded-xl shadow-xs"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-2">
                        <Upload size={16} /> Click or drag to replace
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 space-y-2">
                      <div className="w-12 h-12 rounded-full bg-cream-100 text-caramel-600 flex items-center justify-center mx-auto">
                        <Upload size={22} />
                      </div>
                      <p className="text-xs font-semibold text-chocolate-900">
                        Drag and drop cake photo here, or <span className="text-caramel-600 underline">browse</span>
                      </p>
                      <p className="text-[11px] text-gray-400">
                        PNG, JPG, WEBP, or GIF (Up to 10MB)
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <LinkIcon
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={handleUrlChange}
                      placeholder="https://images.unsplash.com/... or image link"
                      className="input-field pl-9 text-xs"
                    />
                  </div>

                  {imagePreview && (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 h-48 bg-gray-50">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => alert('Could not load image from provided URL.')}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setImageUrlInput('');
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Col: Fields */}
            <div className="lg:col-span-7 space-y-4">
              {/* Cake Title */}
              <div>
                <label className="block text-xs font-bold text-chocolate-800 uppercase tracking-wide mb-1.5">
                  Cake Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='e.g., "3-Tier Floral Ribbon Wedding Cake"'
                  className="input-field text-sm"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold text-chocolate-800 uppercase tracking-wide mb-1.5">
                  Category Dropdown
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field text-xs font-semibold cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description & Tags */}
              <div>
                <label className="block text-xs font-bold text-chocolate-800 uppercase tracking-wide mb-1.5">
                  Description / Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder='e.g., "Buttercream finish, Ribbon flavor, Fresh roses"'
                  className="input-field text-xs"
                />
                <p className="text-[11px] text-chocolate-800/50 mt-1">
                  Separate tags with commas. These appear as decorative tags on the gallery card.
                </p>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-bold text-chocolate-800 uppercase tracking-wide mb-1.5">
                  Design Narrative / Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell clients about the baking inspiration, texture, or artisan techniques..."
                  className="input-field text-xs resize-none"
                />
              </div>

              {/* "Featured on Home" Checkbox */}
              <div className="p-3 rounded-xl bg-cream-50 border border-cream-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="isFeaturedNew"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-caramel-600 focus:ring-caramel-600/30 cursor-pointer"
                  />
                  <label
                    htmlFor="isFeaturedNew"
                    className="text-xs font-semibold text-chocolate-900 cursor-pointer"
                  >
                    Feature on Homepage Showcase
                  </label>
                </div>
                <span className="text-[11px] text-caramel-600 font-semibold bg-caramel-600/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star size={12} /> Prime Display
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploading || !title || !imagePreview}
                  className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Publishing Cake...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Publish Cake to Live Gallery</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>

      {/* Existing Gallery Grid Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-playfair font-bold text-xl sm:text-2xl text-chocolate-900 flex items-center gap-2">
              <span>Existing Gallery Grid</span>
              <span className="text-xs font-montserrat font-bold px-2.5 py-0.5 rounded-full bg-cream-200 text-chocolate-900">
                {filteredGallery.length} Designs
              </span>
            </h2>
            <p className="text-xs text-chocolate-800/60 mt-0.5">
              Review published cake designs, toggle homepage highlights, and remove outdated items.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-chocolate-900 text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-chocolate-800 hover:border-caramel-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Cards Grid */}
        {filteredGallery.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs">
            <ImageIcon size={36} className="mx-auto text-gray-300 mb-2" />
            <p className="font-playfair font-bold text-base text-chocolate-900">
              No Cakes in this Category
            </p>
            <p className="text-xs text-chocolate-800/60 mt-1">
              Upload your first design using the form above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredGallery.map((item) => {
              const targetId = item._id || item.id;
              const isDeleting = deleteConfirmId === targetId;

              return (
                <div
                  key={targetId}
                  className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
                >
                  {/* Image Container with Badges */}
                  <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-2xs">
                        {item.category}
                      </span>
                    </div>

                    {/* Featured Home Pill Badge if true */}
                    {item.isFeatured && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-chocolate-950 shadow-xs">
                          <Star size={11} fill="currentColor" /> Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-playfair font-bold text-base text-chocolate-900 group-hover:text-caramel-600 transition-colors line-clamp-1">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-xs text-chocolate-800/70 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {/* Tag Pills */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(Array.isArray(item.tags)
                            ? item.tags
                            : String(item.tags).split(',')
                          )
                            .slice(0, 3)
                            .map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-cream-50 text-chocolate-800/70 px-2 py-0.5 rounded-md border border-gray-100"
                              >
                                #{tag.trim()}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Action Bar: Featured Toggle & Delete Button */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      {/* Featured on Home Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(item)}
                        title={item.isFeatured ? 'Remove from Homepage' : 'Showcase on Homepage'}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                          item.isFeatured
                            ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-cream-100 hover:text-caramel-600'
                        }`}
                      >
                        <Star
                          size={13}
                          fill={item.isFeatured ? 'currentColor' : 'none'}
                          className={item.isFeatured ? 'text-amber-500' : 'text-gray-400'}
                        />
                        <span className="text-[11px]">
                          {item.isFeatured ? 'On Home' : 'Feature'}
                        </span>
                      </button>

                      {/* Delete Button / Confirm */}
                      {isDeleting ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(targetId)}
                            className="px-2 py-1 bg-rose-600 text-white text-[11px] font-bold rounded hover:bg-rose-700 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-1.5 py-1 text-gray-500 text-[11px] hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(targetId)}
                          title="Remove design from gallery"
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

