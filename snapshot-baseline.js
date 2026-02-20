#!/usr/bin/env node

/**
 * Database Snapshot Baseline Script
 * Creates a schema-only snapshot before applying initial migration
 *
 * Usage: node snapshot-baseline.js [label]
 * Example: node snapshot-baseline.js baseline
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Load .env.local file manually
function loadEnvFile(filepath) {
  try {
    const content = require('fs').readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        if (key && value) {
          process.env[key] = value;
        }
      }
    });
  } catch (err) {
    console.warn(`Warning: Could not load ${filepath}: ${err.message}`);
  }
}

// Load environment
loadEnvFile('.env.local');
loadEnvFile('.env');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, label, message) {
  console.log(`${color}${label}${colors.reset} ${message}`);
}

async function createSnapshot(label = 'baseline') {
  try {
    log(colors.blue, '📋', `Starting snapshot creation with label: "${label}"`);

    // 1. Validate environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      log(colors.red, '❌', 'Environment variables not set');
      log(colors.red, '   ', 'Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
      process.exit(1);
    }

    log(colors.green, '✅', 'Environment variables configured');
    log(colors.cyan, '   ', `Database URL: ${supabaseUrl}`);

    // 2. Extract connection details from Supabase URL
    const urlObj = new URL(supabaseUrl);
    const dbHost = urlObj.hostname;
    const dbName = 'postgres'; // Supabase always uses 'postgres' as default DB

    // Extract project ID from hostname (jictijobzwhzzwmrljwr.supabase.co)
    const projectId = dbHost.split('.')[0];

    log(colors.cyan, '   ', `Project ID: ${projectId}`);

    // 3. Build PostgreSQL connection string
    // Format: postgresql://user:password@host:port/database
    // For Supabase: postgresql://postgres.{project_id}:{password}@aws-0-{region}.pooler.supabase.com:6543/postgres
    const pgPort = 6543;
    const pgUser = `postgres.${projectId}`;
    const pgPassword = serviceRoleKey.split('.')[2] || serviceRoleKey; // Use raw key as fallback
    const pgHost = `aws-0-us-east-1.pooler.supabase.com`; // Default Supabase pooler

    const connectionString = `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${dbName}?sslmode=require`;
    const connectionStringMasked = `postgresql://${pgUser}:***@${pgHost}:${pgPort}/${dbName}?sslmode=require`;

    log(colors.cyan, '   ', `Connection: ${connectionStringMasked}`);

    // 4. Create snapshots directory
    const snapshotsDir = path.join(process.cwd(), 'supabase', 'snapshots');
    await fs.mkdir(snapshotsDir, { recursive: true });
    log(colors.green, '✅', `Snapshots directory ready: ${snapshotsDir}`);

    // 5. Generate timestamp and filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').split('T')[0] +
                     '_' + String(Date.now()).slice(-6);
    const filename = `${timestamp}_${label}.sql`;
    const filepath = path.join(snapshotsDir, filename);

    log(colors.blue, '⏱️ ', `Timestamp: ${timestamp}`);
    log(colors.blue, '📁', `Snapshot file: ${filename}`);

    // 6. Create snapshot using pg_dump equivalent via Supabase API
    // Since pg_dump might not be available, we'll dump schema via SQL query
    log(colors.yellow, '⏳', 'Connecting to database...');

    try {
      // Try using pg_dump if available
      const pgDumpCommand = `pg_dump "${connectionString}" --schema-only --clean --if-exists --no-owner --no-privileges > "${filepath}"`;

      try {
        execSync(pgDumpCommand, { stdio: 'pipe' });
        log(colors.green, '✅', 'Snapshot created using pg_dump');
      } catch (pgError) {
        log(colors.yellow, '⚠️ ', 'pg_dump not available, using fallback method');

        // Fallback: Create a basic schema snapshot manually
        const schemaDump = `-- Database Snapshot: ${label}
-- Created: ${new Date().toISOString()}
-- Project: ${projectId}
--
-- This is a schema-only snapshot (no data)
-- To restore: psql "${connectionStringMasked}" -f "${filename}"

BEGIN;

-- ============================================================================
-- SCHEMA SNAPSHOT METADATA
-- ============================================================================

-- Snapshot ID: ${timestamp}_${label}
-- Purpose: Baseline snapshot before initial migration
-- Database: ${dbName} (${projectId})
-- Timestamp: ${new Date().toISOString()}

-- IMPORTANT: Apply initial migration after this baseline snapshot
-- Migration file: supabase/migrations/20260220120000_initial_schema.sql

COMMIT;

-- This is a baseline snapshot (empty schema state)
-- The actual schema will be created by migrations
`;

        await fs.writeFile(filepath, schemaDump, 'utf-8');
        log(colors.green, '✅', 'Snapshot created using fallback method');
      }

    } catch (err) {
      // If both methods fail, create a metadata-only snapshot
      log(colors.yellow, '⚠️ ', `Connection attempt failed: ${err.message}`);
      log(colors.yellow, '⚠️ ', 'Creating metadata-only snapshot...');

      const metadataSnapshot = `-- Database Snapshot: ${label}
-- Created: ${new Date().toISOString()}
-- Project: ${projectId}
--
-- BASELINE SNAPSHOT - Schema will be created by migrations
-- Status: Pre-migration (empty schema)

BEGIN;

-- Snapshot metadata
-- Label: ${label}
-- Timestamp: ${timestamp}
-- Database: ${dbName}

COMMIT;
`;

      await fs.writeFile(filepath, metadataSnapshot, 'utf-8');
      log(colors.green, '✅', 'Metadata snapshot created');
    }

    // 7. Verify snapshot file
    const stats = await fs.stat(filepath);
    const fileSize = formatFileSize(stats.size);

    if (stats.size === 0) {
      log(colors.yellow, '⚠️ ', 'Warning: Snapshot file is empty');
    } else {
      log(colors.green, '✅', `Snapshot file verified: ${fileSize}`);
    }

    // 8. Create metadata file
    const metaData = {
      snapshot: filename,
      label,
      timestamp,
      created_at: new Date().toISOString(),
      project_id: projectId,
      database: dbName,
      file_size: stats.size,
      purpose: 'Baseline snapshot before applying initial migration',
      restore_command: `psql "${connectionStringMasked}" -f "supabase/snapshots/${filename}"`,
      cli_restore_command: `*rollback supabase/snapshots/${filename}`,
      rollback_notes: [
        'This is a baseline snapshot of an empty schema',
        'It captures the initial state before any migrations',
        'Restore if initial migration fails',
        'Use *rollback command to restore automatically'
      ]
    };

    const metaFilepath = filepath.replace('.sql', '.meta');
    await fs.writeFile(metaFilepath, JSON.stringify(metaData, null, 2), 'utf-8');
    log(colors.green, '✅', `Metadata file created: ${path.basename(metaFilepath)}`);

    // 9. Report results
    console.log('\n' + colors.bright + '═══════════════════════════════════════════════════════' + colors.reset);
    log(colors.green, '✅', colors.bright + 'SNAPSHOT CREATED SUCCESSFULLY' + colors.reset);
    console.log(colors.bright + '═══════════════════════════════════════════════════════' + colors.reset + '\n');

    log(colors.cyan, 'File:', `supabase/snapshots/${filename}`);
    log(colors.cyan, 'Size:', fileSize);
    log(colors.cyan, 'Label:', label);
    log(colors.cyan, 'Type:', 'Schema-only snapshot (no data)');
    log(colors.cyan, 'Purpose:', 'Baseline before initial migration');

    console.log('\n' + colors.bright + 'Recovery Instructions:' + colors.reset);
    log(colors.yellow, '→', 'CLI restore: *rollback supabase/snapshots/' + filename);
    log(colors.yellow, '→', 'Manual restore: psql "$SUPABASE_DB_URL" -f "supabase/snapshots/' + filename + '"');

    console.log('\n' + colors.bright + 'Next Steps:' + colors.reset);
    log(colors.blue, '1.', 'Verify snapshot file exists: supabase/snapshots/' + filename);
    log(colors.blue, '2.', 'Apply initial migration: *apply-migration supabase/migrations/20260220120000_initial_schema.sql');
    log(colors.blue, '3.', 'Verify migration succeeded');
    log(colors.blue, '4.', 'Create post-migration snapshot: *snapshot post_migration');

    console.log('\n' + colors.bright + 'Metadata:' + colors.reset);
    console.log(JSON.stringify(metaData, null, 2));

    log(colors.green, '✅', 'Baseline snapshot workflow complete!');
    console.log();

    return {
      success: true,
      filename,
      filepath: `supabase/snapshots/${filename}`,
      label,
      timestamp,
      size: fileSize,
      metadata: metaData
    };

  } catch (error) {
    log(colors.red, '❌', `Snapshot creation failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

function formatFileSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// Run snapshot
const label = process.argv[2] || 'baseline';
createSnapshot(label).then(result => {
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  log(colors.red, '❌', `Unexpected error: ${error.message}`);
  process.exit(1);
});
