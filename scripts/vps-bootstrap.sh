#!/usr/bin/env bash
# Full one-shot VPS bootstrap for Secure Vista Solutions
# Run ON the VPS as a sudo-capable user:
#   curl -fsSL ... | bash
# or:
#   bash scripts/vps-bootstrap.sh
set -euo pipefail

DOMAIN="${DOMAIN:-securevistasolutions.in}"
APP_DIR="${APP_DIR:-/var/www/securevista}"
REPO="${REPO:-https://github.com/TechbyHIT/securevistrasolutions.git}"
PORT="${PORT:-3005}"
APP_NAME="${APP_NAME:-securevista}"

echo "==> [1/8] System packages"
sudo apt-get update -y
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
  git curl nginx certbot python3-certbot-nginx ufw ca-certificates gnupg

if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
  echo "==> Installing Node.js 20"
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "==> Installing PM2"
  sudo npm i -g pm2
fi

echo "==> [2/8] Firewall (OpenSSH + HTTP/HTTPS)"
sudo ufw allow OpenSSH || true
sudo ufw allow 80/tcp || true
sudo ufw allow 443/tcp || true
sudo ufw --force enable || true

echo "==> [3/8] App directory"
sudo mkdir -p "$(dirname "$APP_DIR")"
sudo chown -R "$USER":"$USER" "$(dirname "$APP_DIR")"
if [[ ! -d "$APP_DIR/.git" ]]; then
  git clone "$REPO" "$APP_DIR"
else
  git -C "$APP_DIR" pull --ff-only origin main || true
fi
cd "$APP_DIR"

echo "==> [4/8] Environment"
if [[ ! -f .env ]]; then
  cp .env.example .env
  # Generate secrets if still placeholders
  ADMIN_PASS="$(openssl rand -base64 18 | tr -d '=+/')"
  ADMIN_SECRET="$(openssl rand -hex 32)"
  REVAL_SECRET="$(openssl rand -hex 32)"
  sed -i \
    -e "s|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://${DOMAIN}|" \
    -e "s|^NEXT_PUBLIC_BUSINESS_EMAIL=.*|NEXT_PUBLIC_BUSINESS_EMAIL=securevista1@gmail.com|" \
    -e "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=${ADMIN_PASS}|" \
    -e "s|^ADMIN_SESSION_SECRET=.*|ADMIN_SESSION_SECRET=${ADMIN_SECRET}|" \
    -e "s|^REVALIDATE_SECRET=.*|REVALIDATE_SECRET=${REVAL_SECRET}|" \
    .env
  {
    echo ""
    echo "PORT=${PORT}"
  } >> .env
  echo "Wrote .env (admin password saved in .env — store it securely)"
fi

echo "==> [5/8] Build + PM2"
if ! npm ci; then
  echo "npm ci failed (lock out of sync). Falling back to npm install..."
  rm -rf node_modules
  npm install
fi
npm run build
node -e "import('./scripts/lib/sync-standalone-assets.mjs').then(m => m.syncStandaloneAssets())"
export PORT HOSTNAME=0.0.0.0
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  PORT="$PORT" pm2 reload ecosystem.config.cjs --update-env
else
  PORT="$PORT" pm2 start ecosystem.config.cjs --update-env
fi
pm2 save
sudo env PATH="$PATH" pm2 startup systemd -u "$USER" --hp "$HOME" | tail -n 1 | bash || true

echo "==> [6/8] Nginx site"
NGINX_SITE="/etc/nginx/sites-available/${DOMAIN}"
sudo tee "$NGINX_SITE" >/dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};

    client_max_body_size 10m;

    location /_next/static/ {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf "$NGINX_SITE" "/etc/nginx/sites-enabled/${DOMAIN}"
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl reload nginx

echo "==> [7/8] Local health check"
sleep 2
curl -fsS -o /dev/null -w "HTTP %{http_code}\n" "http://127.0.0.1:${PORT}/" || {
  echo "App not responding on :${PORT}. Check: pm2 logs ${APP_NAME}"
  exit 1
}

echo "==> [8/8] TLS (Certbot) — requires DNS A records for ${DOMAIN} + www"
if dig +short "$DOMAIN" | grep -q .; then
  sudo certbot --nginx -d "$DOMAIN" -d "www.${DOMAIN}" --non-interactive --agree-tos -m "securevista1@gmail.com" --redirect || \
    echo "Certbot skipped/failed. Point DNS first, then run: sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
else
  echo "DNS for ${DOMAIN} not resolving yet. After A records propagate:"
  echo "  sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
fi

echo ""
echo "============================================"
echo " Secure Vista VPS setup complete"
echo " App dir : ${APP_DIR}"
echo " Port    : ${PORT}"
echo " Domain  : https://${DOMAIN}"
echo " PM2     : pm2 status | pm2 logs ${APP_NAME}"
echo " Redeploy: cd ${APP_DIR} && bash scripts/deploy-vps.sh"
echo "============================================"
