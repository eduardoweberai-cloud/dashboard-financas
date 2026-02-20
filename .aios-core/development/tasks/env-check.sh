#!/bin/bash

###############################################################################
# Task: Environment Check (*env-check)
#
# Purpose: Validate Supabase environment configuration and connectivity
#
# Usage:
#   *env-check              # Run standard validation
#   *env-check --verbose    # Show detailed output
#   *env-check --repair     # Auto-fix common issues
#   *env-check --report     # Generate HTML report
#
# Status: AIOS Implementation Task
# Story: N/A (Infrastructure)
# Version: 1.0.0
###############################################################################

set -o pipefail

# Script configuration
SCRIPT_NAME="env-check"
SCRIPT_VERSION="1.0.0"
PROJECT_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)
ENV_FILE="${PROJECT_ROOT}/.env.local"
ENV_CHECK_SCRIPT="${PROJECT_ROOT}/env-check.js"
REPORT_FILE="${PROJECT_ROOT}/ENV-CHECK-REPORT.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Parse arguments
VERBOSE=false
REPAIR=false
REPORT=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --verbose)
      VERBOSE=true
      shift
      ;;
    --repair)
      REPAIR=true
      shift
      ;;
    --report)
      REPORT=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      print_usage
      exit 1
      ;;
  esac
done

###############################################################################
# Helper Functions
###############################################################################

print_header() {
  echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
  echo -e "${CYAN}║   Supabase Environment Check - AIOS   ║${NC}"
  echo -e "${CYAN}║         v${SCRIPT_VERSION}${NC}"
  echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
  echo ""
}

print_usage() {
  cat << EOF
Usage: $SCRIPT_NAME [OPTIONS]

Options:
  --verbose    Show detailed output including masked credentials
  --repair     Attempt to auto-fix common configuration issues
  --report     Generate HTML report of validation results
  -h, --help   Show this help message

Examples:
  $SCRIPT_NAME                  # Standard validation
  $SCRIPT_NAME --verbose        # With detailed output
  $SCRIPT_NAME --repair         # Try to auto-fix issues

For more information, see: $REPORT_FILE
EOF
}

print_section() {
  echo -e "\n${CYAN}═══════════════════════════════════════${NC}"
  echo -e "${CYAN}$1${NC}"
  echo -e "${CYAN}═══════════════════════════════════════${NC}\n"
}

success() {
  echo -e "${GREEN}✓${NC} $1"
}

error() {
  echo -e "${RED}✗${NC} $1"
}

warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

###############################################################################
# Validation Functions
###############################################################################

check_node_version() {
  print_section "Checking Node.js Installation"

  if ! command -v node &> /dev/null; then
    error "Node.js not installed"
    echo "Install from: https://nodejs.org/"
    return 1
  fi

  local version=$(node --version)
  success "Node.js found: $version"

  # Check minimum version (18.0.0)
  local major=$(echo $version | cut -d'v' -f2 | cut -d'.' -f1)
  if [[ $major -lt 18 ]]; then
    warning "Node.js version 18.0.0 or higher recommended"
    return 0
  fi

  return 0
}

check_env_file() {
  print_section "Checking .env.local File"

  if [[ ! -f "$ENV_FILE" ]]; then
    error ".env.local not found at: $ENV_FILE"
    echo ""
    echo "Create .env.local with required variables:"
    echo "  NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_ID.supabase.co"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG..."
    echo "  SUPABASE_SERVICE_ROLE_KEY=eyJhbG..."
    return 1
  fi

  success ".env.local found"
  info "Location: $ENV_FILE"
  info "Size: $(stat -f%z "$ENV_FILE" 2>/dev/null || stat -c%s "$ENV_FILE" 2>/dev/null) bytes"

  return 0
}

run_validation() {
  print_section "Running Validation Script"

  if [[ ! -f "$ENV_CHECK_SCRIPT" ]]; then
    error "Validation script not found: $ENV_CHECK_SCRIPT"
    return 1
  fi

  success "Executing: node $ENV_CHECK_SCRIPT"
  echo ""

  # Run the actual validation
  if node "$ENV_CHECK_SCRIPT"; then
    return 0
  else
    return 1
  fi
}

show_report() {
  print_section "Validation Report"

  if [[ -f "$REPORT_FILE" ]]; then
    info "Full report available at:"
    info "  $REPORT_FILE"
    echo ""

    if [[ $VERBOSE == true ]]; then
      # Show first 50 lines of report
      head -50 "$REPORT_FILE"
      echo ""
      info "For full report, open: $REPORT_FILE"
    fi
  fi
}

show_next_steps() {
  print_section "Next Steps"

  echo "Your environment is validated and ready! You can:"
  echo ""
  echo "1. Create migrations:"
  echo "   ${BLUE}supabase migration new initial_schema${NC}"
  echo ""
  echo "2. View your project:"
  echo "   ${BLUE}https://supabase.com/dashboard/project/jictijobzwhzzwmrljwr${NC}"
  echo ""
  echo "3. Useful Supabase CLI commands:"
  echo "   supabase status              # Check project status"
  echo "   supabase db push             # Apply migrations"
  echo "   supabase db diff             # Preview changes"
  echo ""
}

###############################################################################
# Repair Functions
###############################################################################

auto_repair() {
  print_section "Auto-Repair Mode"

  local repaired=0

  # Check for common issues
  if ! command -v node &> /dev/null; then
    error "Cannot auto-repair: Node.js not installed"
    return 1
  fi

  # Check if env file has syntax errors
  if [[ -f "$ENV_FILE" ]]; then
    # Try to parse with bash
    if ! bash -n < "$ENV_FILE" 2>/dev/null; then
      warning "Found syntax issues in .env.local"
      # Attempt to fix common issues
      sed -i.bak 's/\r$//' "$ENV_FILE"  # Remove Windows line endings
      success "Fixed line ending issues"
      ((repaired++))
    fi
  fi

  if [[ $repaired -eq 0 ]]; then
    success "No issues found that could be auto-repaired"
  fi

  return 0
}

###############################################################################
# Main Execution
###############################################################################

main() {
  print_header

  # Show configuration
  if [[ $VERBOSE == true ]]; then
    info "Verbose mode: ON"
    info "Project root: $PROJECT_ROOT"
    info "Env file: $ENV_FILE"
    info "Timestamp: $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
    echo ""
  fi

  # Check prerequisites
  if ! check_node_version; then
    error "Environment check failed"
    exit 1
  fi

  if ! check_env_file; then
    error "Environment file check failed"
    exit 1
  fi

  # Auto-repair if requested
  if [[ $REPAIR == true ]]; then
    if ! auto_repair; then
      error "Auto-repair failed"
      exit 1
    fi
  fi

  # Run validation
  if ! run_validation; then
    error "Validation failed"
    echo ""
    warning "Please fix the issues shown above"
    echo ""
    echo "Common fixes:"
    echo "  1. Verify all required variables are set in .env.local"
    echo "  2. Check JWT tokens are valid and not expired"
    echo "  3. Verify Supabase URL is correct"
    echo "  4. Ensure .env.local has proper line endings (Unix, not Windows)"
    echo ""
    exit 1
  fi

  # Show report
  show_report

  # Show next steps
  show_next_steps

  success "All checks passed!"
  echo ""
}

# Handle help request
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
  print_header
  print_usage
  exit 0
fi

# Run main function
main
exit $?
