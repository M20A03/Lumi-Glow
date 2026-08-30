#!/usr/bin/env node
/**
 * 3-Stage Build-Time Environment Validator (Dev / Staging / Prod)
 * LumiGlow SRE Architecture
 */

const requiredEnvVars = {
  production: [
    'VITE_APP_ENV',
    'VITE_SITE_URL',
  ],
  staging: [
    'VITE_APP_ENV',
  ],
  development: []
};

const currentEnv = process.env.VITE_APP_ENV || process.env.NODE_ENV || 'development';

console.log(`\n🔍 [SRE Pipeline] Validating environment configuration for: [${currentEnv.toUpperCase()}]`);

const required = requiredEnvVars[currentEnv] || [];
const missing = [];

for (const key of required) {
  if (!process.env[key] || process.env[key].trim() === '') {
    missing.push(key);
  }
}

if (missing.length > 0) {
  console.error(`\n❌ [BUILD FAILED] Missing mandatory environment variables for ${currentEnv}:`);
  missing.forEach((v) => console.error(`   - ${v}`));
  console.error('\nPlease supply these in your .env or CI/CD deployment secrets.\n');
  process.exit(1);
}

console.log(`✅ [SRE Pipeline] Environment variables validated successfully for ${currentEnv}.\n`);
process.exit(0);
