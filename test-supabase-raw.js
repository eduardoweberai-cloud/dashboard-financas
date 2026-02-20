#!/usr/bin/env node

/**
 * Raw HTTP Test to Supabase REST API
 */

require('dotenv').config({ path: '.env.local' });

async function testRaw() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('\n🔍 Testing Supabase REST API (raw HTTP)...\n');
  console.log('URL:', url);
  console.log('Key:', key.substring(0, 30) + '...');

  try {
    const response = await fetch(`${url}/rest/v1/transactions?select=count()&head=true`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
        'apikey': key,
        'Content-Type': 'application/json',
      },
    });

    console.log('\n📊 Response Status:', response.status);
    console.log('Headers:', {
      'content-type': response.headers.get('content-type'),
      'content-range': response.headers.get('content-range'),
    });

    const text = await response.text();
    console.log('\nResponse Body:', text);

    if (response.ok) {
      console.log('\n✅ REST API connected!');
    } else {
      console.log('\n❌ REST API error');
    }

  } catch (error) {
    console.log('❌ Error:', error instanceof Error ? error.message : error);
  }
}

testRaw();
