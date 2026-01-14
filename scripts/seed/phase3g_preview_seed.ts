import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

type SeedUser = {
  id: string;
  email?: string;
};

const previewEnabled = process.env.PREVIEW_MODE === 'true' || process.env.NODE_ENV !== 'production';

if (!previewEnabled) {
  console.error('Preview seed blocked. Set PREVIEW_MODE=true or run in non-production NODE_ENV.');
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const customerEmail = process.env.SEED_CUSTOMER_EMAIL;
const makerEmail = process.env.SEED_MAKER_EMAIL || 'maker-preview@3d3d.local';
const adminEmail = process.env.SEED_ADMIN_EMAIL || customerEmail;
const defaultPassword = process.env.SEED_DEFAULT_PASSWORD || 'PreviewPass!234';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

if (!customerEmail) {
  console.error('Missing SEED_CUSTOMER_EMAIL for preview seed ownership.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const findUserByEmail = async (email: string): Promise<SeedUser | null> => {
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  const user = data.users.find((entry) => entry.email?.toLowerCase() === email.toLowerCase());
  return user ? { id: user.id, email: user.email } : null;
};

const ensureUser = async (email: string): Promise<SeedUser> => {
  const existing = await findUserByEmail(email);
  if (existing) return existing;
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    password: defaultPassword,
  });
  if (error || !data.user) {
    throw error || new Error('Failed to create user.');
  }
  return { id: data.user.id, email: data.user.email };
};

const ensureRole = async (userId: string, role: string) => {
  const { error } = await supabase
    .from('user_roles')
    .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });
  if (error) throw error;
};

const ensureOrder = async (payload: Record<string, unknown>) => {
  const { data: existing, error } = await supabase
    .from('orders')
    .select('id')
    .eq('order_number', payload.order_number)
    .eq('user_id', payload.user_id)
    .maybeSingle();

  if (error) throw error;
  if (existing?.id) return existing.id as string;

  const { data, error: insertError } = await supabase
    .from('orders')
    .insert(payload)
    .select('id')
    .single();

  if (insertError || !data) {
    throw insertError || new Error('Failed to insert order.');
  }
  return data.id as string;
};

const main = async () => {
  const customerUser = await ensureUser(customerEmail);
  const adminUser = adminEmail ? await ensureUser(adminEmail) : customerUser;
  const makerUser = await ensureUser(makerEmail);

  await ensureRole(adminUser.id, 'admin');
  await ensureRole(makerUser.id, 'maker');

  const { error: makerProfileError } = await supabase
    .from('maker_profiles')
    .upsert(
      {
        maker_id: makerUser.id,
        display_name: 'Preview Maker',
        location: 'Toronto, ON',
        active: true,
      },
      { onConflict: 'maker_id' }
    );
  if (makerProfileError) throw makerProfileError;

  const now = new Date();
  const paidAt = new Date(now.getTime() - 1000 * 60 * 60 * 24);
  const shippedAt = new Date(now.getTime() - 1000 * 60 * 60 * 6);

  const orderNumberA = '3D-PREVIEW-A';
  const orderNumberB = '3D-PREVIEW-B';

  const orderAId = await ensureOrder({
    id: randomUUID(),
    user_id: customerUser.id,
    order_number: orderNumberA,
    quote_snapshot: {
      material: 'PLA_STANDARD',
      quantity: 1,
      quality: 'standard',
      file_name: 'preview-widget.stl',
    },
    total_cad: 42.0,
    currency: 'CAD',
    payment_method: 'credits',
    shipping_address: {
      fullName: 'Preview Customer',
      addressLine1: '100 Demo Street',
      city: 'Toronto',
      province: 'ON',
      postalCode: 'M5V 1A1',
      phone: '555-123-4567',
    },
    status: 'in_production',
    payment_confirmed_at: paidAt.toISOString(),
    status_history: [
      {
        from: 'awaiting_payment',
        to: 'paid',
        reason: 'Preview seed payment',
        changed_by: adminUser.id,
        changed_by_role: 'admin',
        changed_at: paidAt.toISOString(),
      },
      {
        from: 'paid',
        to: 'in_production',
        reason: 'Assigned to maker',
        changed_by: makerUser.id,
        changed_by_role: 'maker',
        changed_at: now.toISOString(),
      },
    ],
    notes: 'Preview seed order (in production)',
  });

  const orderBId = await ensureOrder({
    id: randomUUID(),
    user_id: customerUser.id,
    order_number: orderNumberB,
    quote_snapshot: {
      material: 'PETG',
      quantity: 2,
      quality: 'high',
      file_name: 'preview-gearbox.stl',
    },
    total_cad: 96.5,
    currency: 'CAD',
    payment_method: 'credits',
    shipping_address: {
      fullName: 'Preview Customer',
      addressLine1: '200 Demo Avenue',
      city: 'Toronto',
      province: 'ON',
      postalCode: 'M4B 1B3',
      phone: '555-987-6543',
    },
    status: 'shipped',
    payment_confirmed_at: paidAt.toISOString(),
    status_history: [
      {
        from: 'awaiting_payment',
        to: 'paid',
        reason: 'Preview seed payment',
        changed_by: adminUser.id,
        changed_by_role: 'admin',
        changed_at: paidAt.toISOString(),
      },
      {
        from: 'paid',
        to: 'in_production',
        reason: 'Assigned to maker',
        changed_by: makerUser.id,
        changed_by_role: 'maker',
        changed_at: now.toISOString(),
      },
      {
        from: 'in_production',
        to: 'shipped',
        reason: 'Carrier scan received',
        changed_by: makerUser.id,
        changed_by_role: 'maker',
        changed_at: shippedAt.toISOString(),
      },
    ],
    notes: 'Preview seed order (shipped)',
  });

  const { error: makerOrdersError } = await supabase.from('maker_orders').upsert(
    [
      {
        order_id: orderAId,
        maker_id: makerUser.id,
        status: 'in_production',
        assigned_at: paidAt.toISOString(),
        tracking_info: {},
        notes: 'Preview seed assignment',
      },
      {
        order_id: orderBId,
        maker_id: makerUser.id,
        status: 'shipped',
        assigned_at: paidAt.toISOString(),
        tracking_info: {
          tracking_number: '1Z999AA10123456784',
          carrier: 'UPS',
          shipped_at: shippedAt.toISOString(),
        },
        notes: 'Preview seed shipped order',
      },
    ],
    { onConflict: 'order_id' }
  );
  if (makerOrdersError) throw makerOrdersError;

  const { error: earningsError } = await supabase.from('maker_earnings').upsert(
    [
      {
        maker_id: makerUser.id,
        order_id: orderAId,
        gross_amount_cad: 42.0,
        platform_fee_cad: 12.6,
        payout_amount_cad: 29.4,
        status: 'pending',
      },
      {
        maker_id: makerUser.id,
        order_id: orderBId,
        gross_amount_cad: 96.5,
        platform_fee_cad: 28.95,
        payout_amount_cad: 67.55,
        status: 'paid',
        paid_at: shippedAt.toISOString(),
      },
    ],
    { onConflict: 'order_id' }
  );
  if (earningsError) throw earningsError;

  console.log('Preview seed complete.');
  console.log(`Customer user: ${customerUser.email}`);
  console.log(`Maker user: ${makerUser.email}`);
  console.log(`Admin user: ${adminUser.email}`);
  console.log(`Default password (if created): ${defaultPassword}`);
};

main().catch((error) => {
  console.error('Preview seed failed:', error);
  process.exit(1);
});
