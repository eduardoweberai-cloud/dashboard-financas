#!/usr/bin/env node

/**
 * Database Migration Runner
 * Executes SQL migrations against Supabase PostgreSQL
 *
 * Usage: node run-migrations.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.log('❌ Missing Supabase environment variables');
    console.log('   Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  console.log('📊 Running database migrations...\n');

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log(`📝 Running: ${file}`);

    try {
      // Execute migration using RPC (safer for complex queries)
      // Since Supabase JS client doesn't directly support arbitrary SQL,
      // we'll log instructions for manual execution
      console.log(`   ⚠️  This migration requires manual execution via Supabase SQL Editor`);
      console.log(`   📋 Copy the SQL from: ${filePath}`);
      console.log(`   🔗 Go to: https://supabase.com/dashboard/project/_/sql`);
      console.log(`   ✅ Paste and execute\n`);
    } catch (error) {
      console.log(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    }
  }

  console.log('='.repeat(50));
  console.log('⚠️  IMPORTANT: Manual SQL Execution Required');
  console.log('='.repeat(50));
  console.log('\nTo execute migrations:');
  console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Navigate to SQL Editor');
  console.log('4. Create a new query');
  console.log('5. Copy SQL from each migration file in supabase/migrations/');
  console.log('6. Execute each migration in order\n');
  console.log('Migration files:');
  files.forEach((f) => console.log(`   - ${f}`));
  console.log('');
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
