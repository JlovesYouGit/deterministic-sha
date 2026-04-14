#!/bin/bash

# Activate Gate Watchdog Auto-Execute
# This script sets a persistent boolean flag that activates the watchdog sequence
# Once activated, it will auto-execute on every boot without user intervention

CONFIG_FILE="protocol/watchdog-config.json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_PATH="$SCRIPT_DIR/$CONFIG_FILE"

# Function to activate watchdog
activate_watchdog() {
    if [ ! -f "$CONFIG_PATH" ]; then
        echo "Creating config file..."
        mkdir -p "$(dirname "$CONFIG_PATH")"
    fi

    # Update config file
    cat > "$CONFIG_PATH" << EOF
{
  "watchdogAutoExecute": true,
  "activatedAt": $(date +%s)000,
  "activatedBy": "$USER",
  "persistent": true,
  "version": "1.0.0"
}
EOF

    echo "✓ Gate Watchdog auto-execute ACTIVATED"
    echo "  - Config file: $CONFIG_PATH"
    echo "  - Activated at: $(date)"
    echo "  - Activated by: $USER"
    echo "  - Persistent: true"
    echo ""
    echo "The watchdog sequence will now auto-execute on every boot."
    echo "No further user intervention or terminal runs required."
    echo "This setting will persist even after device reboots."
}

# Function to deactivate watchdog
deactivate_watchdog() {
    if [ ! -f "$CONFIG_PATH" ]; then
        echo "Config file not found. Watchdog is not activated."
        return
    fi

    cat > "$CONFIG_PATH" << EOF
{
  "watchdogAutoExecute": false,
  "activatedAt": null,
  "activatedBy": null,
  "persistent": true,
  "version": "1.0.0"
}
EOF

    echo "✓ Gate Watchdog auto-execute DEACTIVATED"
    echo "  - Config file: $CONFIG_PATH"
    echo "  - Deactivated at: $(date)"
}

# Function to check status
check_status() {
    if [ ! -f "$CONFIG_PATH" ]; then
        echo "Status: NOT ACTIVATED (config file not found)"
        return
    fi

    if command -v jq &> /dev/null; then
        STATUS=$(jq -r '.watchdogAutoExecute' "$CONFIG_PATH")
        if [ "$STATUS" = "true" ]; then
            ACTIVATED_AT=$(jq -r '.activatedAt' "$CONFIG_PATH")
            ACTIVATED_BY=$(jq -r '.activatedBy' "$CONFIG_PATH")
            echo "Status: ACTIVATED"
            echo "  - Activated at: $ACTIVATED_AT"
            echo "  - Activated by: $ACTIVATED_BY"
        else
            echo "Status: NOT ACTIVATED"
        fi
    else
        # Fallback if jq is not available
        if grep -q '"watchdogAutoExecute": true' "$CONFIG_PATH"; then
            echo "Status: ACTIVATED"
        else
            echo "Status: NOT ACTIVATED"
        fi
    fi
}

# Main script logic
case "$1" in
    activate|on|enable|start)
        activate_watchdog
        ;;
    deactivate|off|disable|stop)
        deactivate_watchdog
        ;;
    status|check)
        check_status
        ;;
    *)
        echo "Usage: $0 {activate|deactivate|status}"
        echo ""
        echo "Commands:"
        echo "  activate   - Activate watchdog auto-execute (persistent)"
        echo "  deactivate - Deactivate watchdog auto-execute"
        echo "  status     - Check current activation status"
        echo ""
        echo "Examples:"
        echo "  $0 activate    # Activate (will persist across reboots)"
        echo "  $0 deactivate  # Deactivate"
        echo "  $0 status      # Check status"
        exit 1
        ;;
esac

exit 0

