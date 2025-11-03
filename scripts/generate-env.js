#!/usr/bin/env node

/**
 * Script to generate .env file and update TypeScript declarations
 * from the environment configuration in src/core/config/env.ts
 */

const fs = require('fs');
const path = require('path');

// Import the ENV_CONFIG from the env.ts file
// Since it's TypeScript, we'll need to parse it or use a simpler approach
// For now, let's define the config inline to match the env.ts

const ENV_CONFIG = {
  SHORTENER_SERVICE_BASE_URL: {
    key: 'EXPO_PUBLIC_SHORTENER_SERVICE_BASE_URL',
    defaultValue: 'https://url-shortener-server.onrender.com/api/',
  },
};

function generateEnvFile() {
  const envContent = Object.values(ENV_CONFIG)
    .map(config => `${config.key}=${config.defaultValue}`)
    .join('\n');

  const envPath = path.join(__dirname, '..', '.env');
  fs.writeFileSync(envPath, envContent + '\n');
  console.log('✅ Generated .env file');
}

function generateTypeScriptDeclarations() {
  const envVars = Object.values(ENV_CONFIG).map(config => config.key);

  const tsContent = `/// <reference types="expo/types" />

// NOTE: This file should not be edited and should be in your git ignore

declare namespace NodeJS {
  interface ProcessEnv {
${envVars.map(key => `    ${key}: string;`).join('\n')}
  }
}
`;

  const tsPath = path.join(__dirname, '..', 'expo-env.d.ts');
  fs.writeFileSync(tsPath, tsContent);
  console.log('✅ Generated TypeScript declarations');
}

function main() {
  try {
    generateEnvFile();
    generateTypeScriptDeclarations();
    console.log('🎉 Environment configuration generated successfully!');
  } catch (error) {
    console.error('❌ Error generating environment configuration:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateEnvFile, generateTypeScriptDeclarations };
