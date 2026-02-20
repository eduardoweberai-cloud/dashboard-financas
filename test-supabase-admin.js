#!/usr/bin/env node

/**
 * Supabase Admin Connection Test
 * Tests using service role key (admin access)
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

async function testAdminConnection() {
  console.log('\n🔑 Testing Supabase with Admin (Service Role) Key...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.log('❌ Missing environment variables');
    console.log('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
    console.log('   SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✓' : '✗');
    process.exit(1);
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Try to count transactions (admin access)
    const { data, error, count } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log('❌ Query failed:', error.message);
      console.log('   Code:', error.code);
      console.log('   Details:', JSON.stringify(error));
      process.exit(1);
    }

    console.log('✅ Supabase Admin (Service Role): CONNECTED');
    console.log(`   Transaction count: ${count}`);
    console.log('\n✅ Database is accessible!\n');

    // Test other tables
    console.log('📊 Testing other tables...');
    const tables = ['monthly_budgets', 'metas', 'chat_messages', 'sync_log'];

    for (const table of tables) {
      const { count: c, error: e } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (e) {
        console.log(`   ❌ ${table}: ${e.message}`);
      } else {
        console.log(`   ✅ ${table}: ${c} records`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.log('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

testAdminConnection();
