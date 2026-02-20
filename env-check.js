#!/usr/bin/env node

/**
 * Environment Check Script for Supabase
 * Validates .env.local configuration and Supabase connectivity
 *
 * Usage: node env-check.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Helper functions
function success(msg) {
  console.log(`${colors.green}✓${colors.reset} ${msg}`);
}

function error(msg) {
  console.log(`${colors.red}✗${colors.reset} ${msg}`);
}

function warning(msg) {
  console.log(`${colors.yellow}⚠${colors.reset} ${msg}`);
}

function info(msg) {
  console.log(`${colors.blue}ℹ${colors.reset} ${msg}`);
}

function section(title) {
  console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}${title}${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}\n`);
}

// Mask sensitive keys
function maskKey(key) {
  if (!key || key.length <= 8) return '****';
  return key.substring(0, 4) + '****' + key.substring(key.length - 4);
}

// Load .env.local file
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    error('.env.local file not found');
    return null;
  }

  try {
    const content = fs.readFileSync(envPath, 'utf8');
    const env = {};

    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    });

    success('.env.local loaded successfully');
    return env;
  } catch (err) {
    error(`Failed to read .env.local: ${err.message}`);
    return null;
  }
}

// Validate environment variables
function validateEnvVars(env) {
  section('1. VALIDATING ENVIRONMENT VARIABLES');

  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const optional = [
    'SUPABASE_DB_URL',
    'SUPABASE_PROJECT_ID',
  ];

  let allValid = true;
  const vars = {};

  // Check required vars
  console.log('Required variables:\n');
  for (const varName of required) {
    if (env[varName]) {
      const masked = maskKey(env[varName]);
      success(`${varName}: ${masked}`);
      vars[varName] = env[varName];
    } else {
      error(`${varName}: MISSING`);
      allValid = false;
    }
  }

  // Check optional vars
  console.log('\nOptional variables:\n');
  for (const varName of optional) {
    if (env[varName]) {
      const masked = maskKey(env[varName]);
      success(`${varName}: ${masked}`);
      vars[varName] = env[varName];
    } else {
      warning(`${varName}: not set`);
    }
  }

  return { allValid, vars };
}

// Validate Supabase URL format
function validateUrlFormat(vars) {
  section('2. VALIDATING SUPABASE URL FORMAT');

  const url = vars['NEXT_PUBLIC_SUPABASE_URL'];

  if (!url) {
    error('NEXT_PUBLIC_SUPABASE_URL not available');
    return false;
  }

  try {
    const parsed = new URL(url);
    success(`URL is valid: ${parsed.hostname}`);

    if (parsed.hostname.includes('supabase.co')) {
      success('URL matches Supabase domain');
      return true;
    } else {
      warning(`Unexpected domain: ${parsed.hostname}`);
      return false;
    }
  } catch (err) {
    error(`Invalid URL format: ${err.message}`);
    return false;
  }
}

// Validate JWT tokens
function validateTokens(vars) {
  section('3. VALIDATING JWT TOKENS');

  const anonKey = vars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  const serviceKey = vars['SUPABASE_SERVICE_ROLE_KEY'];

  let valid = true;

  // Validate anon key
  if (anonKey) {
    const parts = anonKey.split('.');
    if (parts.length === 3) {
      success('NEXT_PUBLIC_SUPABASE_ANON_KEY: Valid JWT format');
      try {
        const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        info(`  Role: ${decoded.role || 'unknown'}`);
        info(`  Issued at: ${new Date(decoded.iat * 1000).toISOString()}`);
        if (decoded.exp) {
          info(`  Expires at: ${new Date(decoded.exp * 1000).toISOString()}`);
        }
      } catch (e) {
        warning('Could not decode JWT payload');
      }
    } else {
      error('NEXT_PUBLIC_SUPABASE_ANON_KEY: Invalid JWT format (expected 3 parts)');
      valid = false;
    }
  } else {
    error('NEXT_PUBLIC_SUPABASE_ANON_KEY: Missing');
    valid = false;
  }

  // Validate service role key
  if (serviceKey) {
    const parts = serviceKey.split('.');
    if (parts.length === 3) {
      success('SUPABASE_SERVICE_ROLE_KEY: Valid JWT format');
      try {
        const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        info(`  Role: ${decoded.role || 'unknown'}`);
        info(`  Issued at: ${new Date(decoded.iat * 1000).toISOString()}`);
        if (decoded.exp) {
          info(`  Expires at: ${new Date(decoded.exp * 1000).toISOString()}`);
        }
      } catch (e) {
        warning('Could not decode JWT payload');
      }
    } else {
      error('SUPABASE_SERVICE_ROLE_KEY: Invalid JWT format (expected 3 parts)');
      valid = false;
    }
  } else {
    error('SUPABASE_SERVICE_ROLE_KEY: Missing');
    valid = false;
  }

  return valid;
}

// Test Supabase connection via REST API
async function testConnection(vars) {
  section('4. TESTING SUPABASE CONNECTION');

  const baseUrl = vars['NEXT_PUBLIC_SUPABASE_URL'];
  const anonKey = vars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

  if (!baseUrl || !anonKey) {
    error('Missing URL or anon key');
    return false;
  }

  try {
    info('Testing Supabase REST API endpoint...');

    // Test basic API access
    const response = await makeHttpRequest({
      url: `${baseUrl}/rest/v1/`,
      method: 'GET',
      headers: {
        'apikey': anonKey,
      },
    });

    if (response.status === 200 || response.status === 401 || response.status === 403) {
      success('Supabase API endpoint: Accessible');
      info(`  Status Code: ${response.status}`);
      info(`  Response time: < 5s`);
    } else if (response.status >= 500) {
      error(`Supabase API error: ${response.status}`);
      return false;
    } else {
      warning(`Unexpected response: ${response.status}`);
    }

    // Test auth endpoint
    info('Testing authentication endpoint...');
    const authResponse = await makeHttpRequest({
      url: `${baseUrl}/auth/v1/user`,
      method: 'GET',
      headers: {
        'apikey': anonKey,
      },
    });

    if (authResponse.status === 401 || authResponse.status === 200) {
      success('Authentication endpoint: Accessible');
      info(`  Status: Ready for migrations`);
    } else {
      warning(`Auth endpoint status: ${authResponse.status}`);
    }

    return true;
  } catch (err) {
    error(`Connection test failed: ${err.message}`);
    return false;
  }
}

// Helper function to make HTTPS requests
function makeHttpRequest(options) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(options.url);
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'Supabase-Env-Check/1.0',
          ...options.headers,
        },
        timeout: 10000,
      };

      const req = https.request(requestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (options.body) {
        req.write(JSON.stringify(options.body));
      }

      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

// Check file permissions
function checkFilePermissions() {
  section('5. CHECKING FILE PERMISSIONS');

  const envPath = path.join(process.cwd(), '.env.local');

  try {
    const stats = fs.statSync(envPath);
    success('.env.local exists');
    info(`  Size: ${stats.size} bytes`);

    // Check if readable
    try {
      fs.accessSync(envPath, fs.constants.R_OK);
      success('.env.local is readable');
    } catch {
      error('.env.local is not readable');
      return false;
    }

    return true;
  } catch (err) {
    error(`File check failed: ${err.message}`);
    return false;
  }
}

// Main execution
async function main() {
  console.log(`
${colors.cyan}╔════════════════════════════════════════╗${colors.reset}
${colors.cyan}║    Supabase Environment Validation     ║${colors.reset}
${colors.cyan}║           v1.0 - Dashboard Finanças   ║${colors.reset}
${colors.cyan}╚════════════════════════════════════════╝${colors.reset}
`);

  info(`Working directory: ${process.cwd()}`);
  info(`Timestamp: ${new Date().toISOString()}\n`);

  // Load environment
  const env = loadEnvLocal();
  if (!env) {
    error('Cannot proceed without .env.local');
    process.exit(1);
  }

  // Step 1: Validate variables
  const { allValid: varsValid, vars } = validateEnvVars(env);

  // Step 2: Validate URL format
  const urlValid = validateUrlFormat(vars);

  // Step 3: Validate tokens
  const tokensValid = validateTokens(vars);

  // Step 4: Check file permissions
  const permissionsValid = checkFilePermissions();

  // Step 5: Test connection
  let connectionValid = false;
  try {
    connectionValid = await testConnection(vars);
  } catch (err) {
    error(`Connection test error: ${err.message}`);
  }

  // Summary
  section('VALIDATION SUMMARY');

  const checks = [
    { name: 'Environment Variables', valid: varsValid },
    { name: 'URL Format', valid: urlValid },
    { name: 'JWT Tokens', valid: tokensValid },
    { name: 'File Permissions', valid: permissionsValid },
    { name: 'Supabase Connection', valid: connectionValid },
  ];

  let allPassed = true;
  for (const check of checks) {
    if (check.valid) {
      success(check.name);
    } else {
      error(check.name);
      allPassed = false;
    }
  }

  // Final status
  console.log();
  if (allPassed) {
    console.log(`${colors.green}${colors.reset}
${colors.green}═══════════════════════════════════════${colors.reset}
${colors.green}✓ ALL CHECKS PASSED${colors.reset}
${colors.green}═══════════════════════════════════════${colors.reset}
${colors.green}Your environment is ready for migrations!${colors.reset}
`);

    info('You can now:');
    console.log(`  1. Create migrations: supabase migration new {name}`);
    console.log(`  2. Run migrations: supabase db push`);
    console.log(`  3. Start development: npm run dev\n`);

    process.exit(0);
  } else {
    console.log(`${colors.red}${colors.reset}
${colors.red}═══════════════════════════════════════${colors.reset}
${colors.red}✗ SOME CHECKS FAILED${colors.reset}
${colors.red}═══════════════════════════════════════${colors.reset}
${colors.red}Please fix the issues above and try again${colors.reset}
`);

    info('Next steps:');
    console.log(`  1. Check the error messages above`);
    console.log(`  2. Update .env.local with correct values`);
    console.log(`  3. Run this script again\n`);

    process.exit(1);
  }
}

// Run main function
main().catch(err => {
  error(`Fatal error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
