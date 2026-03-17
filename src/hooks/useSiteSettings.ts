import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/types';

export function useSiteSettings() {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) throw error;
      return data as SiteSettings;
    },
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<SiteSettings>) => {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1)
        .single();

      const { data, error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', existing!.id)
        .select()
        .single();

      if (error) throw error;
      return data as SiteSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
    },
  });
}
