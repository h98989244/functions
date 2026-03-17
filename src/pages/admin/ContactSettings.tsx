import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

const settingsSchema = z.object({
  contact_email: z.string().email('請輸入有效的電子信箱').or(z.literal('')),
  contact_phone: z.string().optional(),
  tax_id: z
    .string()
    .regex(/^\d{8}$/, '統一編號必須為 8 位數字')
    .or(z.literal(''))
    .optional(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function AdminContactSettings() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (settings) {
      reset({
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        tax_id: settings.tax_id || '',
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: SettingsForm) => {
    try {
      await updateSettings.mutateAsync({
        contact_email: data.contact_email || null,
        contact_phone: data.contact_phone || null,
        tax_id: data.tax_id || null,
      });
      toast.success('設定已儲存');
    } catch {
      toast.error('儲存失敗');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-text-primary">聯絡資訊設定</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">電子信箱</label>
          <input {...register('contact_email')} className="input-field" placeholder="contact@example.com" />
          {errors.contact_email && <p className="mt-1 text-xs text-danger">{errors.contact_email.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">聯絡電話</label>
          <input {...register('contact_phone')} className="input-field" placeholder="02-1234-5678" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-secondary">統一編號</label>
          <input {...register('tax_id')} className="input-field" placeholder="12345678" maxLength={8} />
          {errors.tax_id && <p className="mt-1 text-xs text-danger">{errors.tax_id.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center gap-2 px-6 py-2.5"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          儲存設定
        </button>
      </form>
    </div>
  );
}
