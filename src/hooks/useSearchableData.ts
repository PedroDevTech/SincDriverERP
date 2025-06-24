import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';

interface SearchableDataOptions {
  table: string;
  searchFields: string[];
  selectFields?: string;
  minSearchLength?: number;
  limit?: number;
}

export function useSearchableData({
  table,
  searchFields,
  selectFields = '*',
  minSearchLength = 2,
  limit = 50,
}: SearchableDataOptions) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchData = async (query: string) => {
    if (query.length < minSearchLength) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let queryBuilder = supabase
        .from(table)
        .select(selectFields)
        .limit(limit);

      // Construir condições de busca para múltiplos campos
      const searchConditions = searchFields.map(field => {
        // Verificar se é busca por CPF/CNPJ (apenas números)
        if (field === 'cpf' || field === 'cnpj') {
          const numbersOnly = query.replace(/\D/g, '');
          if (numbersOnly.length > 0) {
            return `${field}.ilike.%${numbersOnly}%`;
          }
          return null;
        }
        // Busca normal por texto
        return `${field}.ilike.%${query}%`;
      }).filter(Boolean);

      if (searchConditions.length > 0) {
        queryBuilder = queryBuilder.or(searchConditions.join(','));
      }

      const { data: result, error } = await queryBuilder;

      if (error) {
        throw error;
      }

      setData(result || []);
    } catch (err) {
      console.error('Erro na busca:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatOptions = useMemo(() => {
    return (data: any[], labelField: string, subtitleField?: string) => {
      return data.map(item => ({
        id: item.id,
        label: item[labelField],
        subtitle: subtitleField ? item[subtitleField] : undefined,
        data: item,
      }));
    };
  }, []);

  return {
    data,
    loading,
    error,
    searchData,
    formatOptions,
  };
}