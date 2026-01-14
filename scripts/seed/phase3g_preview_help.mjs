const lines = [
  'Phase 3G Preview Seed Help',
  '',
  'Required env vars:',
  '  PREVIEW_MODE=true',
  '  SUPABASE_URL=https://<project>.supabase.co',
  '  SUPABASE_SERVICE_ROLE_KEY=<service_role_key>',
  '  SEED_CUSTOMER_EMAIL=you@example.com',
  '',
  'Optional env vars:',
  '  SEED_MAKER_EMAIL=maker-preview@example.com',
  '  SEED_ADMIN_EMAIL=admin-preview@example.com',
  '  SEED_DEFAULT_PASSWORD=PreviewPass!234',
  '',
  'Example:',
  '  PREVIEW_MODE=true SUPABASE_URL=https://xyz.supabase.co SUPABASE_SERVICE_ROLE_KEY=***',
  '  SEED_CUSTOMER_EMAIL=you@example.com SEED_MAKER_EMAIL=maker-preview@example.com',
  '  SEED_ADMIN_EMAIL=admin-preview@example.com SEED_DEFAULT_PASSWORD=PreviewPass!234',
  '  pnpm seed:preview',
];

console.log(lines.join('\n'));
