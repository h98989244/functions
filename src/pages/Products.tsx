import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Products() {
  const { data: products, isLoading } = useProducts(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('全部');

  const categories = useMemo(() => {
    if (!products) return ['全部'];
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];
    return ['全部', ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchCategory = category === '全部' || p.category === category;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, category, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold text-text-primary">商品列表</h1>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-primary text-bg-dark'
                  : 'bg-bg-card text-text-secondary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="搜尋商品..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 sm:w-64"
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-text-muted">
          <p className="text-lg">找不到符合條件的商品</p>
        </div>
      )}
    </div>
  );
}
