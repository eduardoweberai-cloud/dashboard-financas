/**
 * Connection Tests
 * Verifies Supabase and Google Sheets API connections
 */

import { healthCheck } from '../db';
import { googleSheetsHealthCheck } from '../google-sheets';

export async function runConnectionTests() {
  console.log('🧪 Running connection tests...\n');

  // Test 1: Supabase connection
  console.log('1️⃣  Testing Supabase connection...');
  try {
    const supabaseHealth = await healthCheck();
    if (supabaseHealth.healthy) {
      console.log('✅ Supabase: OK');
    } else {
      console.log(`❌ Supabase: ${supabaseHealth.message}`);
    }
  } catch (error) {
    console.log(`❌ Supabase test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Test 2: Google Sheets connection
  console.log('\n2️⃣  Testing Google Sheets API connection...');
  try {
    const googleApiKey = process.env.GOOGLE_SHEETS_API_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!googleApiKey || !spreadsheetId) {
      console.log('❌ Google Sheets: Missing API key or spreadsheet ID');
      console.log('   Set GOOGLE_SHEETS_API_KEY and GOOGLE_SHEETS_SPREADSHEET_ID in .env.local');
      return;
    }

    const googleHealth = await googleSheetsHealthCheck(googleApiKey, spreadsheetId);
    if (googleHealth.healthy) {
      console.log('✅ Google Sheets: OK');
      console.log(`   Spreadsheet: ${googleHealth.spreadsheet}`);
      console.log(`   Sheets: ${googleHealth.sheets.join(', ')}`);
    } else {
      console.log(`❌ Google Sheets: ${googleHealth.message}`);
    }
  } catch (error) {
    console.log(
      `❌ Google Sheets test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  console.log('\n✨ Connection tests completed!');
}

// Run tests if executed directly
if (require.main === module) {
  runConnectionTests().catch(console.error);
}
