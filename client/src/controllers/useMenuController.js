import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CAKES } from '../models/cakes';

export const DIETARY_OPTIONS = [
  { label: 'Standard', value: 'standard' },
  { label: '100% Eggless', value: 'eggless' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Sugar-Free', value: 'sugar-free' },
];

/**
 * Controller managing menu search, category filtering, and dietary filter business logic
 */
export function useMenuController() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [dietary, setDietary] = useState('standard');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const filteredCakes = useMemo(() => {
    return CAKES.filter((cake) => {
      const matchSearch =
        !search ||
        cake.name.toLowerCase().includes(search.toLowerCase()) ||
        cake.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        cake.description.toLowerCase().includes(search.toLowerCase());

      const matchCategory = category === 'All' || cake.category === category;
      const matchDietary = dietary === 'standard' || cake.dietary.includes(dietary);

      return matchSearch && matchCategory && matchDietary;
    });
  }, [search, category, dietary]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setDietary('standard');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(search || category !== 'All' || dietary !== 'standard');

  return {
    search,
    setSearch,
    category,
    setCategory: handleCategoryChange,
    dietary,
    setDietary,
    filteredCakes,
    clearFilters,
    hasActiveFilters,
    dietaryOptions: DIETARY_OPTIONS,
  };
}
