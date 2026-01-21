#!/bin/bash

# 1. Get User Input with Examples
echo "Planungseinheit (z.B., 120):"
read planungseinheit

echo "Von: (Format: DD.MM.YYYY, z.B., 01.01.2024):"
read von

echo "Bis: (Format: DD.MM.YYYY, z.B., 31.01.2024):"
read bis

# 2. Open the browser
echo "Opening browser to http://localhost:3000/workflow..."

# Cross-platform 'open' command
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    start http://localhost:3000/workflow
elif [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000/workflow
else
    xdg-open http://localhost:3000/workflow || echo "Could not detect browser launcher."
fi

# 3. Run the npm command
echo "Starting workflow for Case $planungseinheit from $von to $bis..."

npm run dev start -- \
  --WORKFLOW_MODE=true \
  --WORKFLOW_CASE="$planungseinheit" \
  --WORKFLOW_START="$von" \
  --WORKFLOW_END="$bis"
