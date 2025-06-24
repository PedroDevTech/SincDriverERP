/*
  # Correção do Sistema e Adição de Empresas/Filiais

  1. Tabelas de Empresas e Filiais
    - `companies` - Empresas principais
    - `branches` - Filiais das empresas
    - Relacionamentos com outras tabelas

  2. Correções no Sistema
    - Políticas RLS simplificadas
    - Índices adicionais
    - Dados iniciais
*/

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  logo_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  subscription_plan TEXT DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'premium', 'enterprise')),
  subscription_expires_at TIMESTAMPTZ,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de filiais
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  manager_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, code)
);

-- Adicionar company_id e branch_id às tabelas existentes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'branch_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'students' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE students ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'students' AND column_name = 'branch_id'
  ) THEN
    ALTER TABLE students ADD COLUMN branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'instructors' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE instructors ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'instructors' AND column_name = 'branch_id'
  ) THEN
    ALTER TABLE instructors ADD COLUMN branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vehicles' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE vehicles ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vehicles' AND column_name = 'branch_id'
  ) THEN
    ALTER TABLE vehicles ADD COLUMN branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'packages' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE packages ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sales' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE sales ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sales' AND column_name = 'branch_id'
  ) THEN
    ALTER TABLE sales ADD COLUMN branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lessons' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE lessons ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lessons' AND column_name = 'branch_id'
  ) THEN
    ALTER TABLE lessons ADD COLUMN branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exams' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE exams ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exams' AND column_name = 'branch_id'
  ) THEN
    ALTER TABLE exams ADD COLUMN branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accounts_receivable' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE accounts_receivable ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accounts_receivable' AND column_name = 'branch_id'
  ) THEN
    ALTER TABLE accounts_receivable ADD COLUMN branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accounts_payable' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE accounts_payable ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accounts_payable' AND column_name = 'branch_id'
  ) THEN
    ALTER TABLE accounts_payable ADD COLUMN branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'suppliers' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE suppliers ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Habilitar RLS nas novas tabelas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes antes de criar novas
DROP POLICY IF EXISTS "Users can view their own company" ON companies;
DROP POLICY IF EXISTS "Company admins can manage their company" ON companies;
DROP POLICY IF EXISTS "Users can view branches of their company" ON branches;
DROP POLICY IF EXISTS "Company admins can manage branches" ON branches;

-- Políticas para companies
CREATE POLICY "Users can view their own company" ON companies
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Company admins can manage their company" ON companies
  FOR ALL TO authenticated
  USING (
    id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid() 
      AND role_id = 'admin'
    )
  );

-- Políticas para branches
CREATE POLICY "Users can view branches of their company" ON branches
  FOR SELECT TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Company admins can manage branches" ON branches
  FOR ALL TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid() 
      AND role_id IN ('admin', 'manager')
    )
  );

-- Atualizar políticas existentes para usar company_id
DROP POLICY IF EXISTS "Authenticated users can access students" ON students;
CREATE POLICY "Users can access students of their company" ON students
  FOR ALL TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authenticated users can access instructors" ON instructors;
CREATE POLICY "Users can access instructors of their company" ON instructors
  FOR ALL TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authenticated users can access vehicles" ON vehicles;
CREATE POLICY "Users can access vehicles of their company" ON vehicles
  FOR ALL TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authenticated users can access packages" ON packages;
CREATE POLICY "Users can access packages of their company" ON packages
  FOR ALL TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authenticated users can access suppliers" ON suppliers;
CREATE POLICY "Users can access suppliers of their company" ON suppliers
  FOR ALL TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authenticated users can access sales" ON sales;
CREATE POLICY "Users can access sales of their company" ON sales
  FOR ALL TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authenticated users can access lessons" ON lessons;
CREATE POLICY "Users can access lessons of their company" ON lessons
  FOR ALL TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authenticated users can access exams" ON exams;
CREATE POLICY "Users can access exams of their company" ON exams
  FOR ALL TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authenticated users can access accounts_receivable" ON accounts_receivable;
CREATE POLICY "Users can access accounts_receivable of their company" ON accounts_receivable
  FOR ALL TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authenticated users can access accounts_payable" ON accounts_payable;
CREATE POLICY "Users can access accounts_payable of their company" ON accounts_payable
  FOR ALL TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid()
    )
  );

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_branches_company_id ON branches(company_id);
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_students_company_id ON students(company_id);
CREATE INDEX IF NOT EXISTS idx_instructors_company_id ON instructors(company_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_company_id ON vehicles(company_id);
CREATE INDEX IF NOT EXISTS idx_packages_company_id ON packages(company_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_company_id ON suppliers(company_id);
CREATE INDEX IF NOT EXISTS idx_sales_company_id ON sales(company_id);
CREATE INDEX IF NOT EXISTS idx_lessons_company_id ON lessons(company_id);
CREATE INDEX IF NOT EXISTS idx_exams_company_id ON exams(company_id);
CREATE INDEX IF NOT EXISTS idx_accounts_receivable_company_id ON accounts_receivable(company_id);
CREATE INDEX IF NOT EXISTS idx_accounts_payable_company_id ON accounts_payable(company_id);

-- Triggers para updated_at nas novas tabelas
DROP TRIGGER IF EXISTS handle_updated_at ON companies;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON branches;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Inserir empresa de exemplo
INSERT INTO companies (name, cnpj, email, phone, address) VALUES
  ('Auto Escola Sinc Driver', '12.345.678/0001-90', 'contato@sincdriver.com', '(11) 3333-4444', 'Av. Paulista, 1000 - São Paulo, SP')
ON CONFLICT (cnpj) DO NOTHING;

-- Inserir filial de exemplo
INSERT INTO branches (company_id, name, code, address, phone, email)
SELECT id, 'Filial Centro', 'CENTRO', 'Av. Paulista, 1000 - São Paulo, SP', '(11) 3333-4444', 'centro@sincdriver.com'
FROM companies 
WHERE cnpj = '12.345.678/0001-90'
ON CONFLICT (company_id, code) DO NOTHING;