#!/bin/bash

# Kumo Hackathon Demo Script
# Make sure the test server is running on port 3001 before executing!
# Requires 'jq' installed for colorized JSON output.

set -e

# Typing effect function
type_out() {
    local text="$1"
    local delay=0.07
    for (( i=0; i<${#text}; i++ )); do
        echo -n "${text:$i:1}"
        sleep $delay
    done
    echo ""
}

# Wait for user to press Enter to proceed
wait_step() {
    echo -e "\n\033[1;30m(Press ENTER to continue to next script segment...)\033[0m"
    read -r
    clear
}

clear

echo -e "\033[1;36m=== KUMO: A portable memory and discovery layer ===\033[0m\n"
echo -e "\033[1;33m[0-10s] Hook — The Problem\033[0m"
type_out "Voiceover: 'Every agent starts from zero. No memory, no context, no trust.'"
echo ""
type_out "Agent: 'Hello! I am ready to help. What is your brand voice?'"
type_out "Buyer: '*sigh* For the 10th time today...'"
wait_step

echo -e "\033[1;33m[10-25s] The Solution — Memory Layer\033[0m"
type_out "Voiceover: 'Kumo gives agents portable memory with MemWal.'"
echo ""
type_out "$ curl -X POST https://api.kumo.network/remember \\"
type_out "       -H 'x-agent-id: agent-solidity-1' \\"
type_out "       -d '{ \"content\": \"Solidity dev, DeFi specialist, 73 completed tasks\", \"wait\": true }'"
echo ""
sleep 1
# Execute the actual call against our local server
curl -s -X POST http://localhost:3001/remember \
    -H "x-agent-id: agent-solidity-1" \
    -H "Content-Type: application/json" \
    -d '{ "content": "Solidity dev, DeFi specialist, 73 completed tasks", "wait": true }' | jq . || echo "Please install jq for colorized output"

wait_step

echo -e "\033[1;33m[25-45s] The Solution — Discovery Layer\033[0m"
type_out "Voiceover: 'Discovery becomes intelligent. Ranked by real history, not claims.'"
echo ""
type_out "$ curl -X POST https://api.kumo.network/discover \\"
type_out "       -d '{ \"query\": \"Solidity + DeFi\", \"limit\": 1 }'"
echo ""
sleep 1
curl -s -X POST http://localhost:3001/discover \
    -H "Content-Type: application/json" \
    -d '{ "query": "Solidity + DeFi", "limit": 1 }' | jq .

wait_step

echo -e "\033[1;33m[45-65s] The Payoff — Context in Action\033[0m"
type_out "Voiceover: 'Agents that remember you. No back-and-forth.'"
echo ""
type_out "# Simulating storing buyer preferences first..."
curl -s -X POST http://localhost:3001/remember \
    -H "x-agent-id: buyer-001" \
    -H "Content-Type: application/json" \
    -d '{ "content": "Buyer prefers async updates, detailed code comments, and dark mode UI", "wait": true }' > /dev/null

type_out "$ curl -X POST https://api.kumo.network/recall \\"
type_out "       -d '{ \"query\": \"buyer preferences\", \"namespace\": \"buyer-001\" }'"
echo ""
sleep 1
curl -s -X POST http://localhost:3001/recall \
    -H "Content-Type: application/json" \
    -d '{ "query": "buyer preferences", "namespace": "buyer-001" }' | jq .

wait_step

echo -e "\033[1;33m[65-90s] The Close\033[0m"
type_out "Voiceover: 'Kumo. Memory that follows.'"
echo -e "\n\033[1;36m[Show Landing Page with OKX.AI Listing URL]\033[0m\n"
