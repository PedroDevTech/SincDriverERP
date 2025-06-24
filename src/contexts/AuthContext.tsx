import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role_id: string;
  status: 'active' | 'inactive';
  avatar_url?: string;
  company_id?: string;
  branch_id?: string;
  permissions: Array<{
    module: string;
    actions: string[];
  }>;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (module: string, action: 'view' | 'create' | 'edit' | 'delete') => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Carregando perfil para usuário:', supabaseUser.id);
      
      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profileError) {
        console.error('Erro ao carregar perfil:', profileError);
        
        // Se o perfil não existe, criar um básico
        if (profileError.code === 'PGRST116') {
          console.log('Perfil não encontrado, criando perfil básico...');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: supabaseUser.id,
              name: supabaseUser.email?.split('@')[0] || 'Usuário',
              role_id: 'receptionist'
            })
            .select()
            .single();

          if (createError) {
            console.error('Erro ao criar perfil:', createError);
            setIsLoading(false);
            return;
          }

          // Usar o perfil recém-criado
          const userProfile: UserProfile = {
            id: newProfile.id,
            name: newProfile.name,
            email: supabaseUser.email || '',
            role_id: newProfile.role_id,
            status: newProfile.status,
            avatar_url: newProfile.avatar_url,
            company_id: newProfile.company_id,
            branch_id: newProfile.branch_id,
            permissions: [],
          };

          setUser(userProfile);
          setIsLoading(false);
          return;
        }
        
        setIsLoading(false);
        return;
      }

      console.log('Perfil carregado:', profile);

      // Buscar permissões do usuário
      const { data: permissions, error: permissionsError } = await supabase
        .from('role_permissions')
        .select(`
          permissions (
            module,
            action
          )
        `)
        .eq('role_id', profile.role_id);

      if (permissionsError) {
        console.error('Erro ao carregar permissões:', permissionsError);
      }

      // Organizar permissões por módulo
      const organizedPermissions: Array<{ module: string; actions: string[] }> = [];
      const permissionMap = new Map<string, string[]>();

      permissions?.forEach((item: any) => {
        const permission = item.permissions;
        if (permission) {
          const existing = permissionMap.get(permission.module) || [];
          existing.push(permission.action);
          permissionMap.set(permission.module, existing);
        }
      });

      permissionMap.forEach((actions, module) => {
        organizedPermissions.push({ module, actions });
      });

      const userProfile: UserProfile = {
        id: profile.id,
        name: profile.name,
        email: supabaseUser.email || '',
        role_id: profile.role_id,
        status: profile.status,
        avatar_url: profile.avatar_url,
        company_id: profile.company_id,
        branch_id: profile.branch_id,
        permissions: organizedPermissions,
      };

      console.log('Perfil completo carregado:', userProfile);
      setUser(userProfile);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      console.log('Tentando fazer login com:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        setIsLoading(false);
        return false;
      }

      console.log('Login bem-sucedido:', data);

      if (data.user) {
        await loadUserProfile(data.user);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const hasPermission = (module: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
    if (!user) return false;
    
    // Admin tem acesso total
    if (user.role_id === 'admin') return true;
    
    const permission = user.permissions.find(p => p.module === module);
    return permission ? permission.actions.includes(action) : false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}