// Lazy load Supabase only when needed
let supabaseInstance: any = null;

export const getSupabaseClient = async () => {
  if (!supabaseInstance) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseInstance;
};

export const getCarService = async () => {
  const supabase = await getSupabaseClient();
  
  return {
    getAllCars: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    
    getCarById: async (id: string) => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  };
};
