# SVV Car Sharing - Development Environment Setup Script (Windows PowerShell)
# This script helps you quickly switch between different environments

param(
    [Parameter(Position=0)]
    [ValidateSet("local", "production", "status", "cleanup", "reset")]
    [string]$Command
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output (PowerShell compatible)
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Header {
    param([string]$Message)
    Write-Host "[SETUP] $Message" -ForegroundColor Blue
}

# Check if a command exists
function Test-Command {
    param([string]$CommandName)
    $null = Get-Command $CommandName -ErrorAction SilentlyContinue
    return $?
}

# Check if required tools are installed
function Test-Requirements {
    Write-Header "Checking requirements..."
    
    if (-not (Test-Command "node")) {
        Write-Error-Custom "Node.js is not installed. Please install Node.js first."
        exit 1
    }
    
    if (-not (Test-Command "npm")) {
        Write-Error-Custom "npm is not installed. Please install npm first."
        exit 1
    }
    
    # Check for Supabase CLI - either global or local
    $supabaseGlobal = Test-Command "supabase"
    $supabaseLocal = $false
    try {
        $null = npx supabase --version 2>$null
        $supabaseLocal = $true
    } catch {
        $supabaseLocal = $false
    }
    
    if (-not $supabaseGlobal -and -not $supabaseLocal) {
        Write-Error-Custom "Supabase CLI is not installed. Please install it first:"
        Write-Host "  npm install -g supabase"
        Write-Host "  or use the project-local version with: npx supabase"
        exit 1
    }
    
    # Check Docker for local Supabase
    if (-not (Test-Command "docker")) {
        Write-Error-Custom "Docker is not installed. Docker is required for local Supabase."
        Write-Host "  Please install Docker Desktop for Windows first."
        exit 1
    }
    
    Write-Status "All requirements met!"
}

# Function to run Supabase commands (handles both global and local)
function Invoke-Supabase {
    param([string[]]$Arguments)
    
    if (Test-Command "supabase") {
        & supabase @Arguments
    } else {
        & npx supabase @Arguments
    }
}

# Setup local development environment
function Setup-Local {
    Write-Header "Setting up local development environment..."
    
    # Start Supabase locally
    Write-Status "Starting Supabase locally..."
    Invoke-Supabase @("start")
    
    # Generate Prisma client with local env
    Write-Status "Generating Prisma client for local environment..."
    & npm run db:local:generate
    
    # Push database schema
    Write-Status "Pushing database schema..."
    & npm run db:local:push
    
    # Seed database
    Write-Status "Seeding database..."
    & npm run db:local:seed
    
    Write-Status "Local environment setup complete!"
    Write-Warning-Custom "WICHTIG: Für Login-Funktionalität müssen noch Auth-Benutzer angelegt werden!"
    Write-Status "Siehe GETTING_STARTED.md → Abschnitt 'Testbenutzer einrichten'"
    Write-Status "You can now run: npm run dev:local"
}

# Setup production environment
function Setup-Production {
    Write-Header "Setting up production environment..."
    
    # Check if production env file exists
    if (-not (Test-Path ".env.production")) {
        Write-Error-Custom ".env.production file not found!"
        Write-Status "Please create .env.production with your production variables."
        exit 1
    }
    
    # Generate Prisma client with production env
    Write-Status "Generating Prisma client for production environment..."
    & npm run db:production:generate
    
    Write-Status "Production environment setup complete!"
    Write-Status "You can now run: npm run build:production"
}

# Clean up function
function Invoke-Cleanup {
    Write-Header "Cleaning up..."
    
    # Stop Supabase if running
    try {
        $null = Invoke-Supabase @("status") 2>$null
        Write-Status "Stopping Supabase..."
        Invoke-Supabase @("stop")
    } catch {
        # Supabase not running, continue
    }
    
    # Clean Next.js cache
    Write-Status "Cleaning Next.js cache..."
    & npm run clean
    
    Write-Status "Cleanup complete!"
}

# Complete reset function
function Reset-All {
    Write-Header "🔥 COMPLETE RESET - This will destroy ALL local data!"
    Write-Warning-Custom "This will:"
    Write-Host "  - Stop all Supabase containers"
    Write-Host "  - Remove all Docker volumes and data"
    Write-Host "  - Reset the local database completely"
    Write-Host "  - Clean all caches"
    Write-Host ""
    
    $confirm = Read-Host "Are you ABSOLUTELY sure you want to continue? (type 'YES' to confirm)"
    
    if ($confirm -ne "YES") {
        Write-Status "Reset cancelled."
        return
    }
    
    Write-Header "Starting complete reset..."
    
    # Stop and reset Supabase (this removes all data)
    Write-Status "Stopping and resetting Supabase (removes all data)..."
    
    if (Test-Command "supabase") {
        try {
            & supabase stop 2>$null
            # Only try to reset if supabase was running
            try {
                $status = & supabase status 2>$null | Select-String "Started"
                if ($status) {
                    & supabase db reset --local 2>$null
                }
            } catch {
                Write-Status "Supabase was not running, skipping database reset."
            }
        } catch {
            # Continue on error
        }
    } elseif (Test-Command "npx") {
        try {
            & npx supabase stop 2>$null
            # Only try to reset if supabase was running
            try {
                $status = & npx supabase status 2>$null | Select-String "Started"
                if ($status) {
                    & npx supabase db reset --local 2>$null
                }
            } catch {
                Write-Status "Supabase was not running, skipping database reset."
            }
        } catch {
            # Continue on error
        }
    }
    
    # Remove Docker volumes (nuclear option)
    Write-Status "Removing Docker volumes..."
    try {
        # Remove Supabase specific volumes
        $volumes = & docker volume ls -q --filter label=com.supabase.cli.project=svv-car-sharing 2>$null
        if ($volumes) {
            $volumes | ForEach-Object { & docker volume rm $_ 2>$null }
        }
        # General cleanup
        & docker volume prune -f 2>$null
        # Remove any dangling containers
        & docker container prune -f 2>$null
    } catch {
        Write-Warning-Custom "Some Docker cleanup operations failed, but continuing..."
    }
    
    # Clean Next.js and node modules cache
    Write-Status "Cleaning all caches..."
    & npm run clean
    
    # Remove cache directories if they exist
    $cachePaths = @("node_modules\.cache", ".next", "node_modules\.prisma")
    foreach ($path in $cachePaths) {
        if (Test-Path $path) {
            Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    
    Write-Header "✅ Complete reset finished!"
    Write-Status "You can now run '.\dev-setup.ps1 local' to start fresh."
}

# Show status
function Show-Status {
    Write-Header "Environment Status"
    
    Write-Host "📊 Current Environment Variables:"
    $nodeEnv = $env:NODE_ENV
    if (-not $nodeEnv) { $nodeEnv = "not set" }
    Write-Host "  - NODE_ENV: $nodeEnv"
    
    $supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
    if (-not $supabaseUrl) { $supabaseUrl = "not set" }
    Write-Host "  - NEXT_PUBLIC_SUPABASE_URL: $supabaseUrl"
    
    Write-Host ""
    Write-Host "🗄️  Database Status:"
    if (Test-Path ".env.local") {
        Write-Host "  - Local env file: ✅ exists"
    } else {
        Write-Host "  - Local env file: ❌ missing"
    }
    
    if (Test-Path ".env.production") {
        Write-Host "  - Production env file: ✅ exists"
    } else {
        Write-Host "  - Production env file: ❌ missing"
    }
    
    Write-Host ""
    Write-Host "🔧 Supabase Status:"
    try {
        $null = & supabase status 2>$null
        Write-Host "  - Local Supabase: ✅ running"
        & supabase status
    } catch {
        Write-Host "  - Local Supabase: ❌ not running"
    }
}

# Main menu
function Show-Menu {
    Write-Host ""
    Write-Host "🚗 SVV Car Sharing - Environment Setup" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1) Setup Local Development Environment"
    Write-Host "2) Setup Production Environment"
    Write-Host "3) Show Status"
    Write-Host "4) Cleanup"
    Write-Host "5) 🔥 Complete Reset (DESTROYS ALL DATA)"
    Write-Host "6) Exit"
    Write-Host ""
    
    $choice = Read-Host "Choose an option [1-6]"
    
    switch ($choice) {
        "1" {
            Test-Requirements
            Setup-Local
        }
        "2" {
            Test-Requirements
            Setup-Production
        }
        "3" {
            Show-Status
        }
        "4" {
            Invoke-Cleanup
        }
        "5" {
            Reset-All
        }
        "6" {
            Write-Status "Goodbye!"
            exit 0
        }
        default {
            Write-Error-Custom "Invalid option. Please choose 1-6."
            Show-Menu
        }
    }
}

# Main execution logic
if ($Command) {
    switch ($Command) {
        "local" {
            Test-Requirements
            Setup-Local
        }
        "production" {
            Test-Requirements
            Setup-Production
        }
        "status" {
            Show-Status
        }
        "cleanup" {
            Invoke-Cleanup
        }
        "reset" {
            Reset-All
        }
        default {
            Write-Error-Custom "Unknown command: $Command"
            Write-Host "Usage: .\dev-setup.ps1 [local|production|status|cleanup|reset]"
            exit 1
        }
    }
} else {
    Show-Menu
}
