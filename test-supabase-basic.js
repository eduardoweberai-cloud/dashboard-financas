#!/usr/bin/env node

/**
 * Basic Supabase Connection Test
 * Tests if Supabase credentials are valid without querying tables
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

async function testBasicConnection() {
  console.log('\n🧪 Testing basic Supabase connection...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing environment variables');
    console.log('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
    console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✓ Set' : '✗ Missing');
    process.exit(1);
  }

  console.log('✓ Environment variables loaded');
  console.log(`  URL: ${supabaseUrl}`);
  console.log(`  Key: ${supabaseKey.substring(0, 20)}...`);

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✓ Supabase client created');

    // Try to get auth session (doesn't require tables)
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log('\n⚠️  Auth check returned:', error.message);
    } else {
      console.log('✓ Auth endpoint responsive');
    }

    // Try health check endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
      },
    });

    console.log(`\n✅ REST API responsive (Status: ${response.status})`);

    if (response.ok) {
      console.log('\n✅ Supabase connection: SUCCESSFUL');
      console.log('\n📝 Next steps:');
      console.log('1. Execute migrations in Supabase SQL Editor:');
      console.log('   - Go to: https://supabase.com/dashboard');
      console.log('   - Select your project');
      console.log('   - Navigate to SQL Editor');
      console.log('   - Copy & execute each migration from supabase/migrations/');
      console.log('\n2. Run tests again after migrations are complete');
      process.exit(0);
    } else {
      console.log('⚠️  REST API may not be accessible');
      console.log(`Response: ${await response.text().catch(() => 'No text')}`);
      process.exit(1);
    }
  } catch (error) {
    console.log('\n❌ Connection error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

testBasicConnection();
