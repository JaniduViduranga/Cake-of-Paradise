import { useState, useMemo } from 'react';
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '../models/cakes';

const PAGE_SIZE = 9;

/**
 * Controller managing gallery filtering, pagination, and lightbox/request modal state
 */
export function useGalleryController() {
  const [category, setCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filteredItems = useMemo(() => {
    if (category === 'All') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.category === category);
  }, [category]);

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
