#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * This script validates that all required environment variables are set
 * and provides helpful error messages if they're missing.
 */

const fs = require("fs");
const path = require("path");

// Colors for console output
const colors = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    reset: "\x1b[0m",
    bright: "\x1b[1m",
};

function log(message, color = "reset") {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Required environment variables
const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "DATABASE_URL"];

// Optional variables with recommendations
const optionalVars = {
    SUPABASE_SERVICE_ROLE_KEY: "Required for admin operations",
    NEXTAUTH_URL: "Required for authentication",
    NEXTAUTH_SECRET: "Required for authentication security",
    DIRECT_URL: "Recommended for database migrations",
    NODE_ENV: "Should be set to development/production",
};

// Check if .env files exist
function checkEnvFiles() {
    const envFiles = [".env.local", ".env.production", ".env.example"];

    log("\n📁 Checking environment files:", "blue");

    envFiles.forEach((file) => {
        if (fs.existsSync(file)) {
            log(`  ✅ ${file} exists`, "green");
        } else {
            log(`  ❌ ${file} missing`, "red");
        }
    });
}

// Load and validate environment variables
function validateEnvVars(envFile = ".env.local") {
    log(`\n🔍 Validating environment variables in ${envFile}:`, "blue");

    if (!fs.existsSync(envFile)) {
        log(`  ❌ ${envFile} not found`, "red");
        return false;
    }

    // Load env file
    const envContent = fs.readFileSync(envFile, "utf8");
    const envVars = {};

    envContent.split("\n").forEach((line) => {
        if (line.trim() && !line.startsWith("#")) {
            const [key, value] = line.split("=", 2);
            if (key && value) {
                envVars[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
            }
        }
    });

    let isValid = true;

    // Check required variables
    log("  Required variables:", "bright");
    requiredVars.forEach((varName) => {
        if (envVars[varName] && envVars[varName] !== "") {
            log(`    ✅ ${varName}`, "green");
        } else {
            log(`    ❌ ${varName} - Missing or empty`, "red");
            isValid = false;
        }
    });

    // Check optional variables
    log("  Optional variables:", "bright");
    Object.entries(optionalVars).forEach(([varName, description]) => {
        if (envVars[varName] && envVars[varName] !== "") {
            log(`    ✅ ${varName}`, "green");
        } else {
            log(`    ⚠️  ${varName} - ${description}`, "yellow");
        }
    });

    return isValid;
}

// Validate environment configuration
function validateEnvironment(envFile = ".env.local") {
    log("🔧 Environment Configuration Validator", "blue");
    log("=====================================", "blue");

    checkEnvFiles();

    const isValid = validateEnvVars(envFile);

    if (isValid) {
        log("\n✅ All required environment variables are set!", "green");
        log("🚀 Your environment is ready for development.", "green");
    } else {
        log("\n❌ Some required environment variables are missing.", "red");
        log("Please check your .env files and ensure all required variables are set.", "yellow");
        log("\nFor reference, check .env.example for the required format.", "yellow");
        process.exit(1);
    }
}

// Show environment status
function showStatus() {
    log("\n📊 Environment Status:", "blue");
    log("===================", "blue");

    const environments = [
        { name: "Local Development", file: ".env.local" },
        { name: "Production", file: ".env.production" },
    ];

    environments.forEach(({ name, file }) => {
        log(`\n${name} (${file}):`, "bright");
        if (fs.existsSync(file)) {
            validateEnvVars(file);
        } else {
            log(`  ❌ File not found`, "red");
        }
    });
}

// Main execution
if (require.main === module) {
    const command = process.argv[2];

    switch (command) {
        case "status":
            showStatus();
            break;
        case "local":
            validateEnvironment(".env.local");
            break;
        case "production":
            validateEnvironment(".env.production");
            break;
        case "help":
            log("Environment Validation Script", "blue");
            log("Usage: node scripts/validate-env.js [command]", "bright");
            log("Commands:");
            log("  (no command) - Validate .env.local");
            log("  local        - Validate .env.local");
            log("  production   - Validate .env.production");
            log("  status       - Show status of all environments");
            log("  help         - Show this help message");
            break;
        default:
            validateEnvironment();
    }
}

module.exports = { validateEnvVars, checkEnvFiles };

