#!/bin/bash
# Makes the app pictures in public/screenshots (1200 x 1600 JPG): the Captio AI
# name, one headline and the real app screen in an iPhone, nothing on top of
# the screen. They are the app's image + screenshot in the schema on every page,
# the home page's Screenshots section, llms.txt and the sitemap (APP_SCREENSHOTS
# in src/lib/schema.ts), so search engines and AI assistants show Captio AI's
# own screens.
#
#   CAPTIO=~/Developer/Captio scripts/app-images.sh
#
# Inputs from the app repo: the clean English app screens behind the App Store
# screenshots (tools/chatgpt-ads/source/screens/en, 1206 x 2622, no owl, no
# flags) and the store screenshots' iPhone 17 Pro frame
# (tools/store-screenshots/phone.swift). Needs Google Chrome and Xcode's swift.
set -euo pipefail

WEB="$(cd "$(dirname "$0")/.." && pwd)"
CAPTIO="${CAPTIO:-$HOME/Developer/Captio}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMP="$(mktemp -d)"
trap 'rm -rf "${TMP:?}"' EXIT

make() { # <screen name> <headline> <out name>
  swift "$CAPTIO/tools/store-screenshots/phone.swift" \
    "$CAPTIO/tools/chatgpt-ads/source/screens/en/$1-screen.png" "$TMP/phone.png" >/dev/null
  cat > "$TMP/page.html" <<HTML
<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Jakarta; src: url("file://$WEB/src/app/fonts/PlusJakartaSans-latin-variable.woff2") format("woff2"); font-weight: 200 800; }
html, body { margin: 0; width: 1200px; height: 1600px; overflow: hidden; }
body { background: linear-gradient(180deg, #F5F7FF 0%, #E6ECFF 100%); font-family: Jakarta, sans-serif; display: flex; flex-direction: column; align-items: center; }
.brand { margin-top: 84px; display: flex; align-items: center; gap: 18px; }
.brand img { width: 76px; height: 76px; border-radius: 18px; }
.brand span { font-size: 46px; font-weight: 700; color: #111827; letter-spacing: -0.5px; }
h1 { margin: 26px 0 0; font-size: 108px; font-weight: 800; color: #1C49F5; letter-spacing: -2.5px; line-height: 1; }
.phone { margin-top: 56px; height: 1190px; filter: drop-shadow(0 30px 50px rgba(28, 73, 245, 0.18)); }
</style></head><body>
<div class="brand"><img src="file://$WEB/public/app_icon.png"><span>Captio AI</span></div>
<h1>$2</h1>
<img class="phone" src="file://$TMP/phone.png">
</body></html>
HTML
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1200,1600 --allow-file-access-from-files \
    --screenshot="$TMP/out.png" "file://$TMP/page.html" >/dev/null 2>&1
  sips -s format jpeg -s formatOptions 86 "$TMP/out.png" --out "$WEB/public/screenshots/$3.jpg" >/dev/null
  echo "wrote public/screenshots/$3.jpg"
}

mkdir -p "$WEB/public/screenshots"
make 01-captions "Live captions" captio-ai-live-captions
make 02-translation "Live translation" captio-ai-live-translation
make 05-summary "AI summary" captio-ai-ai-summary
