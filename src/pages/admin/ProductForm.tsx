import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X, Upload, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUpsertProduct } from '@/hooks/useProducts';
import toast from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(1, '商品名稱必填'),
  slug: z.string().min(1, 'Slug 必填'),
  category: z.string().optional(),
  short_desc: z.string().optional(),
  description: z.string().optional(),
  buy_url: z.string().optional(),
  instructions: z.string().optional(),
  notice: z.string().optional(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  sort_order: z.number(),
  denominations_input: z.array(z.object({ value: z.number().min(1, '面額需大於 0') })),
});

type ProductFormData = z.infer<typeof productSchema>;

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/[^a-z0-9\u4e00-\u9fff-]/g, '')
    .replace(/-+/g, '-');
}

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const upsertProduct = useUpsertProduct();
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const isEdit = !!id;

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      category: '',
      short_desc: '',
      description: '',
      buy_url: '',
      instructions: '',
      notice: '',
      is_active: true,
      is_featured: false,
      sort_order: 0,
      denominations_input: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'denominations_input',
  });

  // Auto-generate slug from name
  const nameValue = watch('name');
  useEffect(() => {
    if (!isEdit && nameValue) {
      setValue('slug', generateSlug(nameValue));
    }
  }, [nameValue, isEdit, setValue]);

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
      setValue('buy_url', data.buy_url || '');
      setValue('instructions', data.instructions || '');
      setValue('notice', data.notice || '');
      setValue('is_active', data.is_active);
      setValue('is_featured', data.is_featured);
      setValue('sort_order', data.sort_order);
      setImages(data.images || []);
      if (data.denominations) {
        setValue(
          'denominations_input',
          data.denominations.map((d: number) => ({ value: d }))
        );
      }
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

      setImages((prev) => [...prev, urlData.publicUrl]);
      toast.success('圖片上傳成功');
    } catch {
      toast.error('圖片上傳失敗');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const product = {
        ...(id ? { id } : {}),
        name: data.name,
        slug: data.slug,
        category: data.category || null,
        short_desc: data.short_desc || null,
        description: data.description || null,
        buy_url: data.buy_url || null,
        instructions: data.instructions || null,
        notice: data.notice || null,
        is_active: data.is_active,
        is_featured: data.is_featured,
        sort_order: data.sort_order,
        denominations: data.denominations_input.map((d) => d.value),
        images,
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
        {/* Name & Slug */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">商品名稱 *</label>
            <input {...register('name')} className="input-field" placeholder="例：Steam 錢包儲值卡" />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">Slug *</label>
            <input {...register('slug')} className="input-field" placeholder="steam-wallet-card" />
            {errors.slug && <p className="mt-1 text-xs text-danger">{errors.slug.message}</p>}
          </div>
        </div>

        {/* Category & Sort */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">分類</label>
            <input {...register('category')} className="input-field" placeholder="例：Steam" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">排序</label>
            <input type="number" {...register('sort_order', { valueAsNumber: true })} className="input-field" />
          </div>
        </div>

        {/* Short desc */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">簡短說明</label>
          <input {...register('short_desc')} className="input-field" placeholder="一行簡短的商品說明" />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">商品描述</label>
          <textarea {...register('description')} rows={5} className="input-field" placeholder="支援 Markdown 格式" />
        </div>

        {/* Buy URL */}
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">購買連結</label>
          <input {...register('buy_url')} className="input-field" placeholder="https://..." />
        </div>

        {/* Denominations */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">面額</label>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  type="number"
                  {...register(`denominations_input.${index}.value`, { valueAsNumber: true })}
                  className="input-field w-32"
                  placeholder="金額"
                />
                <button type="button" onClick={() => remove(index)} className="text-danger hover:text-red-400">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => append({ value: 0 })}
            className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:text-primary-light"
          >
            <Plus className="h-4 w-4" /> 新增面額
          </button>
        </div>

        {/* Images */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">商品圖片</label>
          <div className="flex flex-wrap gap-3">
            {images.map((url, i) => (
              <div key={i} className="relative h-24 w-24 overflow-hidden rounded-lg border border-border-default">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 rounded bg-bg-dark/70 p-0.5 text-danger"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-border-default hover:border-primary">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <Upload className="h-6 w-6 text-text-muted" />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
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
