#!/bin/bash

# SVV Car Sharing - Development Environment Setup Script
# This script helps you quickly switch between different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Debug mode flag
DEBUG_MODE=${DEBUG:-false}

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

print_debug() {
    if [ "$DEBUG_MODE" = "true" ]; then
        echo -e "${PURPLE}[DEBUG]${NC} $1"
    fi
}

print_progress() {
    echo -e "${CYAN}[PROGRESS]${NC} $1"
}

# Function to check command exit status
check_exit_status() {
    local exit_code=$?
    local command_name=$1
    if [ $exit_code -ne 0 ]; then
        print_error "Command '$command_name' failed with exit code $exit_code"
        return $exit_code
    else
        print_debug "Command '$command_name' completed successfully"
    fi
}

# Function to run commands with logging
run_command() {
    local command_name=$1
    local command_to_run=$2
    
    print_progress "Running: $command_name"
    print_debug "Executing: $command_to_run"
    
    eval "$command_to_run"
    check_exit_status "$command_name"
}

# Check if required tools are installed
check_requirements() {
    print_header "Checking requirements..."
    
    print_progress "Checking Node.js..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    print_debug "Node.js version: $(node --version)"
    
    print_progress "Checking npm..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    print_debug "npm version: $(npm --version)"
    
    # Check for Supabase CLI - either global or local
    print_progress "Checking Supabase CLI..."
    
    # First check for global Supabase CLI
    if command -v supabase &> /dev/null; then
        print_debug "Global Supabase CLI found"
        print_debug "Supabase version: $(supabase --version 2>/dev/null || echo 'version check failed')"
    else
        print_debug "Global Supabase CLI not found, checking local version..."
        # Check local version with timeout to prevent hanging
        if command -v timeout &> /dev/null; then
            # Use timeout if available
            if timeout 10 npx supabase --version &> /dev/null; then
                print_debug "Local Supabase CLI found via npx"
                print_debug "Supabase version: $(timeout 10 npx supabase --version 2>/dev/null || echo 'version check failed')"
            else
                print_error "Supabase CLI is not installed. Please install it first:"
                echo "  npm install -g supabase"
                echo "  or use the project-local version with: npx supabase"
                exit 1
            fi
        else
            # Fallback without timeout
            print_debug "timeout command not available, checking without timeout..."
            if npx supabase --version &> /dev/null; then
                print_debug "Local Supabase CLI found via npx"
                print_debug "Supabase version: $(npx supabase --version 2>/dev/null || echo 'version check failed')"
            else
                print_error "Supabase CLI is not installed. Please install it first:"
                echo "  npm install -g supabase"
                echo "  or use the project-local version with: npx supabase"
                exit 1
            fi
        fi
    fi
    
    # Check Docker for local Supabase
    print_progress "Checking Docker..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Docker is required for local Supabase."
        echo "  Please install Docker first."
        exit 1
    fi
    print_debug "Docker version: $(docker --version)"
    
    print_status "All requirements met!"
}

# Function to run Supabase commands (handles both global and local)
run_supabase() {
    print_debug "Running Supabase command: $*"
    if command -v supabase &> /dev/null; then
        print_debug "Using global Supabase CLI"
        supabase "$@"
    else
        print_debug "Using local Supabase CLI via npx"
        npx supabase "$@"
    fi
    # Don't check exit status for Supabase commands as they might hang
    # check_exit_status "supabase $*"
}

# Setup local development environment
setup_local() {
    print_header "Setting up local development environment..."
    
    # Check if .env.local exists
    print_progress "Checking environment configuration..."
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local file not found!"
        print_status "Please create .env.local with your local environment variables."
        print_status "You can copy from .env.example if available."
        exit 1
    fi
    print_debug ".env.local file found"
    
    # Check if Supabase is already running
    print_progress "Checking if Supabase is already running..."
    if run_supabase status &> /dev/null; then
        print_debug "Supabase is already running, skipping start"
        print_status "Supabase is already running!"
    else
        # Start Supabase locally
        print_progress "Starting Supabase locally..."
        print_debug "This may take a few minutes on first run..."
        print_debug "About to run: run_supabase start"
        run_supabase start
        print_debug "Supabase start command completed"
    fi
    
    # Wait a moment for Supabase to fully start
    print_progress "Waiting for Supabase services to be ready..."
    print_debug "Sleeping for 5 seconds..."
    sleep 5
    print_debug "Sleep completed"
    
    # Generate Prisma client with local env
    print_progress "Generating Prisma client for local environment..."
    print_debug "About to run: npm run db:local:generate"
    run_command "Prisma generate" "npm run db:local:generate"
    print_debug "Prisma generate completed"
    
    # Push database schema
    print_progress "Pushing database schema..."
    print_debug "About to run: npm run db:local:push"
    run_command "Database schema push" "npm run db:local:push"
    print_debug "Database schema push completed"
    
    # Seed database
    print_progress "Seeding database..."
    print_debug "About to run: npm run db:local:seed"
    run_command "Database seeding" "npm run db:local:seed"
    print_debug "Database seeding completed"
    
    # Create authentication users and database records
    print_progress "Creating authentication users and database records..."
    print_debug "About to run: npm run auth:create-users"
    run_command "Auth user creation" "npm run auth:create-users"
    print_debug "Auth user creation completed"
    
    # Import match data from spielplan.csv
    print_progress "Importing match data from spielplan.csv..."
    print_debug "About to run: npm run import:spielplan"
    run_command "Match data import" "npm run import:spielplan"
    print_debug "Match data import completed"
    
    # Create comprehensive test data (users + rides)
    print_progress "Creating comprehensive test data (additional users + ride data)..."
    print_debug "About to run: npm run create:test-data"
    run_command "Test data creation" "npm run create:test-data"
    print_debug "Test data creation completed"
    
    print_status "Local environment setup complete!"
    print_status "Test user credentials:"
    echo "  All 7 users have password: test1234"
    echo "  Email format: firstname.lastname@test.com"
    echo "  Users: max.mustermann, anna.schmidt, tom.mueller, lisa.weber,"
    echo "         ben.schneider, sara.fischer, noah.hoffmann"

    print_status "You can now run: npm run dev:local"
}

# Setup production environment
setup_production() {
    print_header "Setting up production environment..."
    
    # Check if production env file exists
    print_progress "Checking production environment configuration..."
    if [ ! -f ".env.production" ]; then
        print_error ".env.production file not found!"
        print_status "Please create .env.production with your production variables."
        exit 1
    fi
    print_debug ".env.production file found"
    
    # Generate Prisma client with production env
    print_progress "Generating Prisma client for production environment..."
    run_command "Prisma generate (production)" "npm run db:production:generate"
    
    print_status "Production environment setup complete!"
    print_status "You can now run: npm run build:production"
}

# Clean up function
cleanup() {
    print_header "Cleaning up..."
    
    # Stop Supabase if running
    print_progress "Checking if Supabase is running..."
    if run_supabase status &> /dev/null; then
        print_progress "Stopping Supabase..."
        run_supabase stop
    else
        print_debug "Supabase was not running"
    fi
    
    # Clean Next.js cache
    print_progress "Cleaning Next.js cache..."
    run_command "Cache cleanup" "npm run clean"
    
    print_status "Cleanup complete!"
}

# Complete reset function
reset_all() {
    print_header "🔥 COMPLETE RESET - This will destroy ALL local data!"
    print_warning "This will:"
    echo "  - Stop all Supabase containers"
    echo "  - Remove all Docker volumes and data"
    echo "  - Reset the local database completely"
    echo "  - Clean all caches"
    echo ""
    
    read -p "Are you ABSOLUTELY sure you want to continue? (type 'YES' to confirm): " confirm
    
    if [ "$confirm" != "YES" ]; then
        print_status "Reset cancelled."
        return 0
    fi
    
    print_header "Starting complete reset..."
    
    # Stop and reset Supabase (this removes all data)
    print_progress "Stopping and resetting Supabase (removes all data)..."
    if command -v supabase &> /dev/null; then
        print_debug "Using global Supabase CLI for reset"
        supabase stop 2>/dev/null || true
        # Only try to reset if supabase was running
        if supabase status 2>/dev/null | grep -q "Started"; then
            print_progress "Resetting Supabase database..."
            supabase db reset --local 2>/dev/null || true
        else
            print_status "Supabase was not running, skipping database reset."
        fi
    elif npx supabase --version &> /dev/null; then
        print_debug "Using local Supabase CLI for reset"
        npx supabase stop 2>/dev/null || true
        # Only try to reset if supabase was running
        if npx supabase status 2>/dev/null | grep -q "Started"; then
            print_progress "Resetting Supabase database..."
            npx supabase db reset --local 2>/dev/null || true
        else
            print_status "Supabase was not running, skipping database reset."
        fi
    fi
    
    # Remove Docker volumes (nuclear option)
    print_progress "Removing Docker volumes..."
    # Remove Supabase specific volumes
    print_debug "Removing Supabase-specific Docker volumes..."
    docker volume ls -q --filter label=com.supabase.cli.project=svv-car-sharing | xargs -r docker volume rm 2>/dev/null || true
    # General cleanup
    print_debug "Running Docker volume prune..."
    docker volume prune -f 2>/dev/null || true
    # Remove any dangling containers
    print_debug "Running Docker container prune..."
    docker container prune -f 2>/dev/null || true
    
    # Clean Next.js and node modules cache
    print_progress "Cleaning all caches..."
    run_command "Cache cleanup" "npm run clean"
    print_debug "Removing additional cache directories..."
    rm -rf node_modules/.cache 2>/dev/null || true
    rm -rf .next 2>/dev/null || true
    
    # Clean Prisma generated files
    print_progress "Cleaning Prisma generated files..."
    rm -rf node_modules/.prisma 2>/dev/null || true
    
    print_header "✅ Complete reset finished!"
    print_status "You can now run './dev-setup.sh local' to start fresh."
}

# Get Supabase keys
get_supabase_keys() {
    print_header "Getting Supabase Keys"
    
    # Check if Docker is running
    if ! docker info &> /dev/null; then
        print_error "Docker is not running!"
        print_status "Please start Docker first."
        exit 1
    fi
    
    # Check if Supabase is running
    if ! run_supabase status &> /dev/null; then
        print_warning "Supabase is not running!"
        print_status "Starting Supabase locally..."
        print_status "This may take a few minutes on first run..."
        
        # Start Supabase with background process and timeout
        print_progress "Starting Supabase (this may take a few minutes)..."
        
        # Use a more robust start approach
        print_progress "Starting Supabase in background..."
        
        # Start Supabase in background
        run_supabase start &
        SUPABASE_PID=$!
        
        # Wait for start with progress indicator
        print_progress "Waiting for Supabase to start..."
        for i in {1..30}; do
            if run_supabase status &> /dev/null; then
                print_status "Supabase started successfully!"
                break
            fi
            if [ $i -eq 30 ]; then
                print_error "Supabase failed to start within 5 minutes!"
                kill $SUPABASE_PID 2>/dev/null || true
                exit 1
            fi
            sleep 10
            print_progress "Still waiting... ($i/30)"
        done
    else
        print_status "Supabase is already running!"
    fi
    
    # Wait a moment for services to be ready
    print_progress "Waiting for Supabase services to be ready..."
    sleep 10
    
    # Get the keys
    print_progress "Extracting Supabase keys..."
    
    # Check if jq is available
    if ! command -v jq &> /dev/null; then
        print_warning "jq is not installed. Installing jq..."
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y jq
        elif command -v yum &> /dev/null; then
            sudo yum install -y jq
        elif command -v brew &> /dev/null; then
            brew install jq
        else
            print_error "Could not install jq automatically. Please install jq manually."
            exit 1
        fi
    fi
    
    # Get the status in JSON format
    print_status "Getting Supabase status..."
    SUPABASE_STATUS=$(run_supabase status --output json 2>/dev/null)
    
    if [ $? -ne 0 ]; then
        print_error "Failed to get Supabase status. Make sure Supabase is running."
        exit 1
    fi
    
    # Extract keys
    ANON_KEY=$(echo "$SUPABASE_STATUS" | jq -r '.api.anon_key' 2>/dev/null)
    SERVICE_ROLE_KEY=$(echo "$SUPABASE_STATUS" | jq -r '.api.service_role_key' 2>/dev/null)
    
    if [ "$ANON_KEY" = "null" ] || [ "$SERVICE_ROLE_KEY" = "null" ]; then
        print_error "Could not extract keys from Supabase status."
        print_status "Raw status output:"
        echo "$SUPABASE_STATUS"
        exit 1
    fi
    
    print_status "Keys extracted successfully!"
    
    # Display the keys
    print_header "Your Supabase Keys:"
    echo ""
    echo "🔑 ANON KEY (for .env.local):"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=\"$ANON_KEY\""
    echo ""
    echo "🔐 SERVICE ROLE KEY (for .env.local):"
    echo "SUPABASE_SERVICE_ROLE_KEY=\"$SERVICE_ROLE_KEY\""
    echo ""
    echo "🌐 SUPABASE URL (for .env.local):"
    echo "NEXT_PUBLIC_SUPABASE_URL=\"http://localhost:54321\""
    echo ""
    
    # Create .env.local template
    read -p "Do you want to create/update .env.local with these keys? (Y/n): " create_env
    if [ "$create_env" != "n" ] && [ "$create_env" != "N" ]; then
        print_header "Creating .env.local template..."
        
        if [ -f ".env.local" ]; then
            print_warning ".env.local already exists!"
            read -p "Do you want to overwrite it? (y/N): " overwrite
            if [ "$overwrite" != "y" ] && [ "$overwrite" != "Y" ]; then
                print_status "Skipping .env.local creation."
                return
            fi
        fi
        
        cat > .env.local << EOF
# ===========================================
# LOCAL DEVELOPMENT ENVIRONMENT
# ===========================================
# This file is for local development with local Supabase

# Database - Local Supabase
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@localhost:54322/postgres"

# Supabase - Local Instance
NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="$ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="$SERVICE_ROLE_KEY"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-development-secret-key"

# Environment
NODE_ENV="development"
EOF
        
        print_status ".env.local created successfully!"
    fi
    
    echo ""
    print_status "Done! You can now use these keys in your environment files."
}

# Show status
show_status() {
    print_header "Environment Status"
    
    echo "📊 Current Environment Variables:"
    echo "  - NODE_ENV: ${NODE_ENV:-'not set'}"
    echo "  - NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:-'not set'}"
    echo "  - DEBUG: ${DEBUG_MODE}"
    
    echo ""
    echo "🗄️  Database Status:"
    if [ -f ".env.local" ]; then
        echo "  - Local env file: ✅ exists"
    else
        echo "  - Local env file: ❌ missing"
    fi
    
    if [ -f ".env.production" ]; then
        echo "  - Production env file: ✅ exists"
    else
        echo "  - Production env file: ❌ missing"
    fi
    
    echo ""
    echo "🔧 Supabase Status:"
    if run_supabase status &> /dev/null; then
        echo "  - Local Supabase: ✅ running"
        run_supabase status
    else
        echo "  - Local Supabase: ❌ not running"
    fi
    
    echo ""
    echo "📦 Package Status:"
    if [ -f "package.json" ]; then
        echo "  - package.json: ✅ exists"
        print_debug "Project name: $(node -p "require('./package.json').name")"
        print_debug "Project version: $(node -p "require('./package.json').version")"
    else
        echo "  - package.json: ❌ missing"
    fi
    
    if [ -f "prisma/schema.prisma" ]; then
        echo "  - Prisma schema: ✅ exists"
    else
        echo "  - Prisma schema: ❌ missing"
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "🚗 SVV Car Sharing - Environment Setup"
    echo "====================================="
    echo ""
    echo "1) Setup Local Development Environment"
    echo "2) Setup Production Environment"
    echo "3) Show Status"
    echo "4) Get Supabase Keys"
    echo "5) Cleanup"
    echo "6) 🔥 Complete Reset (DESTROYS ALL DATA)"
    echo "7) Exit"
    echo ""
    read -p "Choose an option [1-7]: " choice
    
    case $choice in
        1)
            check_requirements
            setup_local
            ;;
        2)
            check_requirements
            setup_production
            ;;
        3)
            show_status
            ;;
        4)
            get_supabase_keys
            ;;
        5)
            cleanup
            ;;
        6)
            reset_all
            ;;
        7)
            print_status "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid option. Please choose 1-7."
            show_menu
            ;;
    esac
}

# If script is run with arguments, handle them
if [ $# -gt 0 ]; then
    case $1 in
        "local")
            check_requirements
            setup_local
            ;;
        "production")
            check_requirements
            setup_production
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        "reset")
            reset_all
            ;;
        "keys")
            get_supabase_keys
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Usage: $0 [local|production|status|cleanup|reset|keys]"
            echo "Debug mode: DEBUG=true $0 [command]"
            exit 1
            ;;
    esac
else
    show_menu
fi