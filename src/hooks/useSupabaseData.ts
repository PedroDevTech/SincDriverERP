import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

export function useSupabaseData<T extends keyof Tables>(
  table: T,
  options?: {
    select?: string;
    filter?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
  }
) {
  const [data, setData] = useState<Tables[T]['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [table, JSON.stringify(options)]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(table).select(options?.select || '*');

      // Aplicar filtros
      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Aplicar ordenação
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending ?? true 
        });
      }

      const { data: result, error } = await query;

      if (error) {
        throw error;
      }

      setData(result || []);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const insert = async (newData: Tables[T]['Insert']) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(newData)
        .select()
        .single();

      if (error) throw error;

      setData(prev => [...prev, result]);
      return { data: result, error: null };
    } catch (err) {
      console.error('Erro ao inserir:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  };

  const update = async (id: string, updates: Tables[T]['Update']) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setData(prev => prev.map(item => 
        item.id === id ? result : item
      ));
      return { data: result, error: null };
    } catch (err) {
      console.error('Erro ao atualizar:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  };

  const remove = async (id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setData(prev => prev.filter(item => item.id !== id));
      return { error: null };
    } catch (err) {
      console.error('Erro ao excluir:', err);
      return { error: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    insert,
    update,
    remove,
  };
}