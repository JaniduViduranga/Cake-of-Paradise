import { Search, X } from 'lucide-react';
import CakeCard from '../components/common/CakeCard';
import SectionHeading from '../components/common/SectionHeading';
import { CATEGORIES } from '../../models/cakes';
import { useMenuController } from '../../controllers/useMenuController';

export default function Menu() {
  const {
    search,
    setSearch,
    category,
    setCategory,
    dietary,
    setDietary,
    filteredCakes,
    clearFilters,
    hasActiveFilters,
    dietaryOptions,
  } = useMenuController();

  return (
    <div className="min-h-screen bg-cream-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 text-center">
          <SectionHeading
            title="Our Artisanal Selection"
            subtitle="Discover our handcrafted cakes and pastries, baked fresh daily using the finest ingredients."
          />
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-4">
          {/* Search + Dietary Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-4">
            {/* Search */}
            <div className="relative flex-1 max-w-xl">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-chocolate-800/30" />
              <input
                type="text"
                id="menu-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search our menu..."
                className="input-field pl-10 pr-10"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate-800/30 hover:text-chocolate-800/70"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Dietary Toggles */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="font-montserrat text-xs font-semibold text-chocolate-800/50 uppercase tracking-wide">Dietary:</span>
              {dietaryOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer font-montserrat text-sm text-chocolate-800/70 hover:text-chocolate-900 transition-colors"
                >
                  <input
                    type="radio"
                    name="dietary"
                    value={opt.value}
                    checked={dietary === opt.value}
                    onChange={() => setDietary(opt.value)}
                    className="accent-caramel-600"
                    id={`dietary-${opt.value}`}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 scrollbar-hide overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`category-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setCategory(cat)}
                className={`category-pill whitespace-nowrap ${
                  category === cat ? 'category-pill-active' : 'category-pill-inactive'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-10">
        {/* Result count */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-montserrat text-sm text-chocolate-800/50">
            {filteredCakes.length === 0
              ? 'No cakes found'
              : `Showing ${filteredCakes.length} cake${filteredCakes.length === 1 ? '' : 's'}`}
            {search && <span> for "<span className="font-semibold text-chocolate-800">{search}</span>"</span>}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="font-montserrat text-xs text-caramel-600 hover:text-caramel-700 font-semibold flex items-center gap-1"
            >
              <X size={13} />
              Clear filters
            </button>
          )}
        </div>

        {filteredCakes.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-6xl mb-4">🎂</div>
            <h3 className="font-playfair font-bold text-2xl text-chocolate-900 mb-2">No cakes found</h3>
            <p className="font-montserrat text-sm text-chocolate-800/50">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="btn-primary mt-6"
            >
              Show All Cakes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCakes.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
