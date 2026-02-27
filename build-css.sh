#!/bin/bash
# Skrypt do przebudowy tailwind.min.css po zmianach w index.html
# Wymaga: Node.js (npx)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔧 Instalacja tailwindcss v3..."
npm install --no-save tailwindcss@3 2>/dev/null

# Tymczasowe pliki konfiguracyjne
cat > _tw_config.js <<'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './index-offline.html'],
  theme: { extend: {} },
  plugins: [],
}
EOF

cat > _tw_input.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

echo "⚙️  Budowanie tailwind.min.css..."
npx tailwindcss@3 -c _tw_config.js -i _tw_input.css -o tailwind.min.css --minify

# Sprzątanie
rm -f _tw_config.js _tw_input.css
rm -rf node_modules package.json package-lock.json

echo "✅ Gotowe — tailwind.min.css zaktualizowany."
