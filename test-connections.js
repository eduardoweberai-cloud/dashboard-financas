#!/usr/bin/env node

/**
 * Connection Test Script
 * Verifies Supabase and Google Sheets API connections
 *
 * Usage: node test-connections.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

async function testSupabaseConnection() {
  console.log('\n1️⃣  Testing Supabase connection...');

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Supabase: Missing environment variables');
      console.log('   Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
      return false;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try a simple query
    const { data, error } = await supabase
      .from('transactions')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.log(`❌ Supabase: Connection failed`);
      console.log(`   Error: ${error.message}`);
      console.log(`   Code: ${error.code}`);
      console.log(`   Details: ${JSON.stringify(error)}`);
      return false;
    }

    console.log('✅ Supabase: Connection successful');
    return true;
  } catch (error) {
    console.log(`❌ Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}

async function testGoogleSheetsConnection() {
  console.log('\n2️⃣  Testing Google Sheets API connection...');

  try {
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!apiKey || !spreadsheetId) {
      console.log('❌ Google Sheets: Missing API key or spreadsheet ID');
      console.log('   Set GOOGLE_SHEETS_API_KEY and GOOGLE_SHEETS_SPREADSHEET_ID in .env.local');
      return false;
    }

    // Test API connection
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
      { params: { key: apiKey } }
    );

    const title = response.data.properties?.title || 'Unknown';
    const sheets = response.data.sheets?.map((s) => s.properties.title) || [];

    console.log('✅ Google Sheets: Connection successful');
    console.log(`   Spreadsheet: ${title}`);
    console.log(`   Sheets: ${sheets.join(', ')}`);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(`❌ Google Sheets: ${error.response?.data?.error?.message || error.message}`);
    } else {
      console.log(`❌ Google Sheets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    return false;
  }
}

async function main() {
  console.log('🧪 Running connection tests...');

  const supabaseOk = await testSupabaseConnection();
  const googleOk = await testGoogleSheetsConnection();

  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results:');
  console.log(`   Supabase: ${supabaseOk ? '✅ OK' : '❌ FAILED'}`);
  console.log(`   Google Sheets: ${googleOk ? '✅ OK' : '⚠️ PENDING (set vars if needed)'}`);
  console.log('='.repeat(50));

  if (!supabaseOk) {
    console.log('\n⚠️  Supabase connection test FAILED');
    process.exit(1);
  }

  console.log('\n✨ Connection tests completed!');
  process.exit(0);
}

main().catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});
