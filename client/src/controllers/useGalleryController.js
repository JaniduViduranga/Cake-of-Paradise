import { useState, useMemo, useEffect } from 'react';
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '../models/cakes';
import { getGallery } from '../services/api';

const PAGE_SIZE = 9;

/**
 * Controller managing gallery filtering, pagination, live updates, and lightbox/request modal state
 */
export function useGalleryController() {
  const [category, setCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [liveItems, setLiveItems] = useState([]);

  // Fetch live gallery items published from Admin Dashboard
  useEffect(() => {
    let isMounted = true;
    const loadLiveGallery = async () => {
      try {
        const res = await getGallery();
        const data = res.data?.data || res.data?.items || [];
        if (isMounted && data.length > 0) {
          // Normalize items
          const mapped = data.map((item) => ({
            id: item._id || item.id,
            title: item.title,
            image: item.image,
            category: item.category,
            description: item.description,
            tags: item.tags,
            isFeatured: item.isFeatured,
          }));

          // Merge live items with static GALLERY_ITEMS avoiding duplicate titles
          const existingTitles = new Set(mapped.map((m) => m.title.toLowerCase()));
          const combined = [
            ...mapped,
            ...GALLERY_ITEMS.filter((g) => !existingTitles.has(g.title.toLowerCase())),
          ];
          setLiveItems(combined);
        }
      } catch (err) {
        // Fallback to static items
        if (isMounted) setLiveItems(GALLERY_ITEMS);
      }
    };

    loadLiveGallery();
    return () => {
      isMounted = false;
    };
  }, []);

  const itemsPool = liveItems.length > 0 ? liveItems : GALLERY_ITEMS;

  const filteredItems = useMemo(() => {
    if (category === 'All') return itemsPool;
    return itemsPool.filter((item) => {
      const cat = (item.category || '').toLowerCase();
      const target = category.toLowerCase();
      return cat.includes(target) || target.includes(cat);
    });
  }, [category, itemsPool]);

  const visibleItems = filteredItems.slice(0, visible);
  const hasMore = visible < filteredItems.length;

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setVisible(PAGE_SIZE);
  };

  const loadMore = () => {
    setVisible((v) => v + PAGE_SIZE);
  };

  return {
    category,
    setCategory: handleCategorySelect,
    categories: GALLERY_CATEGORIES,
    visibleItems,
    hasMore,
    loadMore,
    lightboxItem,
    setLightboxItem,
    requestModalOpen,
    setRequestModalOpen,
  };
}
