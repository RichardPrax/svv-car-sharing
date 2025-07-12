#!/bin/bash

# SVV Car Sharing - Development Environment Setup Script
# This script helps you quickly switch between different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if required tools are installed
check_requirements() {
    print_header "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check for Supabase CLI - either global or local
    if ! command -v supabase &> /dev/null && ! npx supabase --version &> /dev/null; then
        print_error "Supabase CLI is not installed. Please install it first:"
        echo "  npm install -g supabase"
        echo "  or use the project-local version with: npx supabase"
        exit 1
    fi
    
    # Check Docker for local Supabase
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Docker is required for local Supabase."
        echo "  Please install Docker first."
        exit 1
    fi
    
    print_status "All requirements met!"
}

# Function to run Supabase commands (handles both global and local)
run_supabase() {
    if command -v supabase &> /dev/null; then
        supabase "$@"
    else
        npx supabase "$@"
    fi
}

# Setup local development environment
setup_local() {
    print_header "Setting up local development environment..."
    
    # Start Supabase locally
    print_status "Starting Supabase locally..."
    run_supabase start
    
    # Generate Prisma client with local env
    print_status "Generating Prisma client for local environment..."
    npm run db:local:generate
    
    # Push database schema
    print_status "Pushing database schema..."
    npm run db:local:push
    
    # Seed database
    print_status "Seeding database..."
    npm run db:local:seed
    
    print_status "Local environment setup complete!"
    print_warning "WICHTIG: Für Login-Funktionalität müssen noch Auth-Benutzer angelegt werden!"
    print_status "Siehe GETTING_STARTED.md → Abschnitt 'Testbenutzer einrichten'"
    print_status "You can now run: npm run dev:local"
}

# Setup production environment
setup_production() {
    print_header "Setting up production environment..."
    
    # Check if production env file exists
    if [ ! -f ".env.production" ]; then
        print_error ".env.production file not found!"
        print_status "Please create .env.production with your production variables."
        exit 1
    fi
    
    # Generate Prisma client with production env
    print_status "Generating Prisma client for production environment..."
    npm run db:production:generate
    
    print_status "Production environment setup complete!"
    print_status "You can now run: npm run build:production"
}

# Clean up function
cleanup() {
    print_header "Cleaning up..."
    
    # Stop Supabase if running
    if run_supabase status &> /dev/null; then
        print_status "Stopping Supabase..."
        run_supabase stop
    fi
    
    # Clean Next.js cache
    print_status "Cleaning Next.js cache..."
    npm run clean
    
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
    print_status "Stopping and resetting Supabase (removes all data)..."
    if command -v supabase &> /dev/null; then
        supabase stop 2>/dev/null || true
        # Only try to reset if supabase was running
        if supabase status 2>/dev/null | grep -q "Started"; then
            supabase db reset --local 2>/dev/null || true
        else
            print_status "Supabase was not running, skipping database reset."
        fi
    elif npx supabase --version &> /dev/null; then
        npx supabase stop 2>/dev/null || true
        # Only try to reset if supabase was running
        if npx supabase status 2>/dev/null | grep -q "Started"; then
            npx supabase db reset --local 2>/dev/null || true
        else
            print_status "Supabase was not running, skipping database reset."
        fi
    fi
    
    # Remove Docker volumes (nuclear option)
    print_status "Removing Docker volumes..."
    # Remove Supabase specific volumes
    docker volume ls -q --filter label=com.supabase.cli.project=svv-car-sharing | xargs -r docker volume rm 2>/dev/null || true
    # General cleanup
    docker volume prune -f 2>/dev/null || true
    # Remove any dangling containers
    docker container prune -f 2>/dev/null || true
    
    # Clean Next.js and node modules cache
    print_status "Cleaning all caches..."
    npm run clean
    rm -rf node_modules/.cache 2>/dev/null || true
    rm -rf .next 2>/dev/null || true
    
    # Clean Prisma generated files
    print_status "Cleaning Prisma generated files..."
    rm -rf node_modules/.prisma 2>/dev/null || true
    
    print_header "✅ Complete reset finished!"
    print_status "You can now run './dev-setup.sh local' to start fresh."
}

# Show status
show_status() {
    print_header "Environment Status"
    
    echo "📊 Current Environment Variables:"
    echo "  - NODE_ENV: ${NODE_ENV:-'not set'}"
    echo "  - NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:-'not set'}"
    
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
    if supabase status &> /dev/null; then
        echo "  - Local Supabase: ✅ running"
        supabase status
    else
        echo "  - Local Supabase: ❌ not running"
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
    echo "4) Cleanup"
    echo "5) 🔥 Complete Reset (DESTROYS ALL DATA)"
    echo "6) Exit"
    echo ""
    read -p "Choose an option [1-6]: " choice
    
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
            cleanup
            ;;
        5)
            reset_all
            ;;
        6)
            print_status "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid option. Please choose 1-6."
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
        *)
            print_error "Unknown command: $1"
            echo "Usage: $0 [local|production|status|cleanup|reset]"
            exit 1
            ;;
    esac
else
    show_menu
fi
