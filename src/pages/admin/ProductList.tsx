import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, ShoppingCart } from 'lucide-react';
import { useProducts, useDeleteProduct, useToggleProductActive } from '@/hooks/useProducts';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminProductList() {
  const { data: products, isLoading } = useProducts(false);
  const deleteProduct = useDeleteProduct();
  const toggleActive = useToggleProductActive();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!products) return [];
    if (!search) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`確定要刪除「${name}」嗎？此操作無法復原。`)) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success('商品已刪除');
    } catch {
      toast.error('刪除失敗');
    }
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    try {
      await toggleActive.mutateAsync({ id, is_active: !currentActive });
      toast.success(currentActive ? '商品已下架' : '商品已上架');
    } catch {
      toast.error('操作失敗');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-text-primary">商品管理</h1>
        <Link to="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> 新增商品
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="搜尋商品名稱..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10 sm:w-72"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border-default">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-surface text-text-secondary">
            <tr>
              <th className="px-4 py-3">商品</th>
              <th className="px-4 py-3">分類</th>
              <th className="px-4 py-3">價格</th>
              <th className="px-4 py-3">狀態</th>
              <th className="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {filtered.map((product) => (
              <tr key={product.id} className="bg-bg-card hover:bg-bg-card-hover">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-bg-surface">
                      {product.image_url ? (
                        <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingCart className="h-4 w-4 text-text-muted" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-text-primary">{product.name}【{product.price.toLocaleString()}點】</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{product.category || '-'}</td>
                <td className="px-4 py-3 text-text-secondary text-amber-400 font-semibold">
                  NT$ {product.price.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggle(product.id, product.is_active)}
                    className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                      product.is_active
                        ? 'bg-success/10 text-success'
                        : 'bg-danger/10 text-danger'
                    }`}
                  >
                    {product.is_active ? '上架中' : '已下架'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/products/${product.id}`}
                      className="rounded p-1.5 text-text-secondary hover:bg-bg-surface hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="rounded p-1.5 text-text-secondary hover:bg-bg-surface hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-text-muted">
            沒有找到商品
          </div>
        )}
      </div>
    </div>
  );
}
