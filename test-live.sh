#!/bin/bash

# Test Remember
echo "Testing /remember..."
curl -s -i -X POST https://kumo-agent.vercel.app/remember \
  -H "Content-Type: application/json" \
  -H "x-402-signature: dummy-signature" \
  -H "x-402-payment: dummy-payment" \
  -H "x-agent-id: kumo-tester-01" \
  -d '{"content": "Kumo is successfully deployed on Vercel and tests are passing!"}'
echo -e "\n\n"

# Test Recall
echo "Testing /recall..."
curl -s -i -X POST https://kumo-agent.vercel.app/recall \
  -H "Content-Type: application/json" \
  -H "x-402-signature: dummy-signature" \
  -H "x-402-payment: dummy-payment" \
  -d '{"namespace": "kumo-tester-01", "query": "Vercel"}'
echo -e "\n\n"

# Test Analyze
echo "Testing /analyze..."
curl -s -i -X POST https://kumo-agent.vercel.app/analyze \
  -H "Content-Type: application/json" \
  -H "x-402-signature: dummy-signature" \
  -H "x-402-payment: dummy-payment" \
  -d '{"namespace": "kumo-tester-01", "content": "Kumo will analyze this and extract facts in the background using waitUntil."}'
echo -e "\n\n"

# Test Discover
echo "Testing /discover..."
curl -s -i -X POST https://kumo-agent.vercel.app/discover \
  -H "Content-Type: application/json" \
  -H "x-402-signature: dummy-signature" \
  -H "x-402-payment: dummy-payment" \
  -d '{"query": "Kumo", "limit": 5}'
echo -e "\n"
