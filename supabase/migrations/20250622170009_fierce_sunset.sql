/*
  # Dados Iniciais do Sistema

  1. Roles e Permissões
    - Criação dos perfis de acesso
    - Definição das permissões por módulo
    - Relacionamento entre perfis e permissões

  2. Dados de Exemplo
    - Alguns registros iniciais para demonstração
    - Usuário administrador padrão
*/

-- Inserir roles
INSERT INTO roles (id, name, description, color) VALUES
  ('admin', 'Administrador', 'Acesso total ao sistema', 'purple'),
  ('manager', 'Gerente', 'Gerenciamento geral da auto escola', 'blue'),
  ('seller', 'Vendedor', 'Vendas e atendimento ao cliente', 'green'),
  ('financial', 'Financeiro', 'Controle financeiro e contabilidade', 'yellow'),
  ('instructor', 'Instrutor', 'Agendamento de aulas e avaliações', 'orange'),
  ('receptionist', 'Recepcionista', 'Atendimento e cadastros básicos', 'pink')
ON CONFLICT (id) DO NOTHING;

-- Inserir permissões
INSERT INTO permissions (module, action, description) VALUES
  ('dashboard', 'view', 'Visualizar dashboard'),
  ('students', 'view', 'Visualizar alunos'),
  ('students', 'create', 'Criar alunos'),
  ('students', 'edit', 'Editar alunos'),
  ('students', 'delete', 'Excluir alunos'),
  ('instructors', 'view', 'Visualizar instrutores'),
  ('instructors', 'create', 'Criar instrutores'),
  ('instructors', 'edit', 'Editar instrutores'),
  ('instructors', 'delete', 'Excluir instrutores'),
  ('vehicles', 'view', 'Visualizar veículos'),
  ('vehicles', 'create', 'Criar veículos'),
  ('vehicles', 'edit', 'Editar veículos'),
  ('vehicles', 'delete', 'Excluir veículos'),
  ('lessons', 'view', 'Visualizar aulas'),
  ('lessons', 'create', 'Criar aulas'),
  ('lessons', 'edit', 'Editar aulas'),
  ('lessons', 'delete', 'Excluir aulas'),
  ('exams', 'view', 'Visualizar exames'),
  ('exams', 'create', 'Criar exames'),
  ('exams', 'edit', 'Editar exames'),
  ('exams', 'delete', 'Excluir exames'),
  ('packages', 'view', 'Visualizar pacotes'),
  ('packages', 'create', 'Criar pacotes'),
  ('packages', 'edit', 'Editar pacotes'),
  ('packages', 'delete', 'Excluir pacotes'),
  ('sales', 'view', 'Visualizar vendas'),
  ('sales', 'create', 'Criar vendas'),
  ('sales', 'edit', 'Editar vendas'),
  ('sales', 'delete', 'Excluir vendas'),
  ('financial', 'view', 'Visualizar financeiro'),
  ('financial', 'create', 'Criar registros financeiros'),
  ('financial', 'edit', 'Editar registros financeiros'),
  ('financial', 'delete', 'Excluir registros financeiros'),
  ('schedule', 'view', 'Visualizar agendas'),
  ('reports', 'view', 'Visualizar relatórios'),
  ('users', 'view', 'Visualizar usuários'),
  ('users', 'create', 'Criar usuários'),
  ('users', 'edit', 'Editar usuários'),
  ('users', 'delete', 'Excluir usuários'),
  ('settings', 'view', 'Visualizar configurações'),
  ('settings', 'edit', 'Editar configurações')
ON CONFLICT (module, action) DO NOTHING;

-- Permissões para Vendedor
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'seller', id FROM permissions 
WHERE (module = 'dashboard' AND action = 'view')
   OR (module = 'students' AND action IN ('view', 'create', 'edit'))
   OR (module = 'packages' AND action = 'view')
   OR (module = 'sales' AND action IN ('view', 'create'))
   OR (module = 'schedule' AND action = 'view')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Permissões para Financeiro
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'financial', id FROM permissions 
WHERE (module = 'dashboard' AND action = 'view')
   OR (module = 'financial' AND action IN ('view', 'create', 'edit', 'delete'))
   OR (module = 'sales' AND action = 'view')
   OR (module = 'students' AND action = 'view')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Permissões para Instrutor
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'instructor', id FROM permissions 
WHERE (module = 'dashboard' AND action = 'view')
   OR (module = 'lessons' AND action IN ('view', 'create', 'edit'))
   OR (module = 'students' AND action = 'view')
   OR (module = 'exams' AND action IN ('view', 'edit'))
   OR (module = 'schedule' AND action = 'view')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Permissões para Gerente
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'manager', id FROM permissions 
WHERE module IN ('dashboard', 'students', 'instructors', 'vehicles', 'lessons', 'exams', 'packages', 'schedule')
   AND action IN ('view', 'create', 'edit')
   OR (module = 'sales' AND action = 'view')
   OR (module = 'financial' AND action = 'view')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Permissões para Recepcionista
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'receptionist', id FROM permissions 
WHERE (module = 'dashboard' AND action = 'view')
   OR (module = 'students' AND action IN ('view', 'create', 'edit'))
   OR (module = 'lessons' AND action = 'view')
   OR (module = 'schedule' AND action = 'view')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Inserir alguns pacotes de exemplo
INSERT INTO packages (name, description, category, price, theoretical_hours, practical_hours, exam_attempts, validity_days) VALUES
  ('Pacote Categoria B - Básico', 'Pacote completo para primeira habilitação categoria B', 'B', 1800.00, 45, 20, 2, 365),
  ('Pacote Categoria B - Premium', 'Pacote premium com aulas extras e simulados', 'B', 2500.00, 50, 30, 3, 450),
  ('Pacote Categoria A - Completo', 'Pacote para habilitação de motocicleta', 'A', 1500.00, 45, 20, 2, 365),
  ('Pacote Categoria C - Caminhão', 'Adição de categoria C para caminhões', 'C', 2200.00, 50, 25, 2, 365)
ON CONFLICT DO NOTHING;

-- Inserir alguns fornecedores de exemplo
INSERT INTO suppliers (name, cnpj, email, phone, address, category) VALUES
  ('Posto Ipiranga Centro', '12.345.678/0001-90', 'contato@postipiranga.com', '(11) 3333-4444', 'Av. Paulista, 1000 - São Paulo, SP', 'fuel'),
  ('Oficina do João', '98.765.432/0001-10', 'joao@oficina.com', '(11) 2222-3333', 'Rua das Oficinas, 456 - São Paulo, SP', 'maintenance'),
  ('Papelaria Escolar', '11.222.333/0001-44', 'vendas@papelaria.com', '(11) 1111-2222', 'Rua do Comércio, 789 - São Paulo, SP', 'supplies')
ON CONFLICT DO NOTHING;