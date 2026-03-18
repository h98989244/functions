import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, ChevronLeft, Loader2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUpsertProduct } from '@/hooks/useProducts';
import toast from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(1, '商品名稱必填'),
  slug: z.string().min(1, 'Slug 必填'),
  category: z.string().optional(),
  short_desc: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(1, '面額需大於 0'),
  buy_url: z.string().optional(),
  instructions: z.string().optional(),
  notice: z.string().optional(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  sort_order: z.number(),
});

type ProductFormValues = z.infer<typeof productSchema>;

function generateSlug(name: string, price: number): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/[^a-z0-9\u4e00-\u9fff-]/g, '')
    .replace(/-+/g, '-');
  return `${base}-${price}`;
}

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const upsertProduct = useUpsertProduct();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const isEdit = !!id;

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      category: '',
      short_desc: '',
      description: '',
      price: 0,
      buy_url: '',
      instructions: '',
      notice: '',
      is_active: true,
      is_featured: false,
      sort_order: 0,
    },
  });

  // Auto-generate slug from name + price
  const nameValue = watch('name');
  const denomValue = watch('price');
  useEffect(() => {
    if (!isEdit && nameValue) {
      setValue('slug', generateSlug(nameValue, denomValue || 0));
    }
  }, [nameValue, denomValue, isEdit, setValue]);

  // Load existing product for editing
  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) {
        toast.error('商品載入失敗');
        navigate('/admin/products');
        return;
      }
      setValue('name', data.name);
      setValue('slug', data.slug);
      setValue('category', data.category || '');
      setValue('short_desc', data.short_desc || '');
      setValue('description', data.description || '');
      setValue('price', data.price || 0);
      setValue('buy_url', data.buy_url || '');
      setValue('instructions', data.instructions || '');
      setValue('notice', data.notice || '');
      setValue('is_active', data.is_active);
      setValue('is_featured', data.is_featured);
      setValue('sort_order', data.sort_order);
      setImageUrl(data.image_url || null);
    };
    loadProduct();
  }, [id, setValue, navigate]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('圖片大小不能超過 5MB');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setImageUrl(urlData.publicUrl);
      toast.success('圖片上傳成功');
    } catch {
      toast.error('圖片上傳失敗');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const product = {
        ...(id ? { id } : {}),
        name: data.name,
        slug: data.slug,
        category: data.category || null,
        short_desc: data.short_desc || null,
        description: data.description || null,
        price: data.price,
        image_url: imageUrl,
        buy_url: data.buy_url || null,
        instructions: data.instructions || null,
        notice: data.notice || null,
        is_active: data.is_active,
        is_featured: data.is_featured,
        sort_order: data.sort_order,
      };

      await upsertProduct.mutateAsync(product);
      toast.success(isEdit ? '商品已更新' : '商品已建立');
      navigate('/admin/products');
    } catch {
      toast.error('儲存失敗');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        to="/admin/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" /> 返回商品列表
      </Link>

      <h1 className="mb-8 text-2xl font-bold text-text-primary">
        {isEdit ? '編輯商品' : '新增商品'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name & Denomination */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">商品名稱 *</label>
            <input {...register('name')} className="input-field" placeholder="例：MyCard" />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">面額 (點數) *</label>
            <input
              type="number"
              {...register('price', { valueAsNumber: true })}
              className="input-field"
              placeholder="例：1000"
            />
            {errors.price && <p className="mt-1 text-xs text-danger">{errors.price.message}</p>}
          </div>
        </div>

        {/* Slug & Category */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">Slug *</label>
            <input {...register('slug')} className="input-field" placeholder="mycard-1000" />
            {errors.slug && <p className="mt-1 text-xs text-danger">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">分類</label>
            <input {...register('category')} className="input-field" placeholder="例：MyCard" />
          </div>
        </div>

        {/* Sort order */}
        <div className="w-32">
          <label className="mb-1 block text-sm font-medium text-text-secondary">排序</label>
          <input type="number" {...register('sort_order', { valueAsNumber: true })} className="input-field" />
        </div>

        {/* Short desc */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">簡短說明</label>
          <input {...register('short_desc')} className="input-field" placeholder="一行簡短的商品說明" />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">商品描述</label>
          <textarea {...register('description')} rows={4} className="input-field" placeholder="詳細商品描述" />
        </div>

        {/* Buy URL */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">購買連結</label>
          <input {...register('buy_url')} className="input-field" placeholder="https://..." />
        </div>

        {/* Image */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">商品圖片</label>
          <div className="flex items-start gap-4">
            {imageUrl ? (
              <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-border-default">
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="absolute right-1 top-1 rounded bg-bg-dark/70 p-0.5 text-danger"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border-default hover:border-primary">
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-text-muted" />
                    <span className="mt-1 text-xs text-text-muted">上傳圖片</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Instructions & Notice */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">使用說明</label>
          <textarea {...register('instructions')} rows={3} className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">注意事項</label>
          <textarea {...register('notice')} rows={3} className="input-field" />
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('is_active')} className="h-4 w-4 accent-primary" />
            <span className="text-sm text-text-secondary">上架中</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('is_featured')} className="h-4 w-4 accent-primary" />
            <span className="text-sm text-text-secondary">精選商品</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2 px-8 py-3"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? '更新商品' : '建立商品'}
          </button>
          <Link to="/admin/products" className="text-sm text-text-secondary hover:text-text-primary">
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
