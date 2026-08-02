# Deployment (VPS + PM2 + Nginx)

Production stack for **Secure Vista Solutions**:

- Domain: `https://securevistasolutions.in`
- App port: **3005** (behind Nginx)
- Process manager: **PM2**
- Next.js `output: "standalone"` (no Docker)

Repo: https://github.com/TechbyHIT/securevistrasolutions.git

---

## 1) VPS prerequisites (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install -y git nginx certbot python3-certbot-nginx

# Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

sudo npm i -g pm2
```

---

## 2) Clone & configure

```bash
sudo mkdir -p /var/www
sudo chown -R "$USER":"$USER" /var/www
cd /var/www
git clone https://github.com/TechbyHIT/securevistrasolutions.git securevista
cd securevista

cp .env.example .env
nano .env   # set secrets below
```

Minimum `.env` values:

```env
NEXT_PUBLIC_SITE_URL=https://securevistasolutions.in
NEXT_PUBLIC_BUSINESS_EMAIL=securevista1@gmail.com
NEXT_PUBLIC_PHONE_DISPLAY=+91 95020 96677
NEXT_PUBLIC_PHONE_RAW=+919502096677
NEXT_PUBLIC_WHATSAPP_DISPLAY=+91 95020 96677
NEXT_PUBLIC_WHATSAPP_RAW=919502096677
ADMIN_USERNAME=admin
ADMIN_PASSWORD=use-a-strong-password
ADMIN_SESSION_SECRET=long-random-string
REVALIDATE_SECRET=long-random-string
PORT=3005
```

---

## 3) Build & start with PM2

```bash
cd /var/www/securevista
chmod +x scripts/deploy-vps.sh
bash scripts/deploy-vps.sh
```

Or manually:

```bash
npm ci
npm run build
node -e "import('./scripts/lib/sync-standalone-assets.mjs').then(m => m.syncStandaloneAssets())"
PORT=3005 pm2 start ecosystem.config.cjs --update-env
pm2 save
pm2 startup   # follow the printed command once
```

Check:

```bash
curl -I http://127.0.0.1:3005
pm2 logs securevista
```

---

## 4) Nginx reverse proxy

Create `/etc/nginx/sites-available/securevistasolutions.in`:

```nginx
server {
    listen 80;
    server_name securevistasolutions.in www.securevistasolutions.in;

    client_max_body_size 10m;

    location / {
        proxy_pass http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable + SSL:

```bash
sudo ln -sf /etc/nginx/sites-available/securevistasolutions.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d securevistasolutions.in -d www.securevistasolutions.in
```

Point DNS **A records** for `@` and `www` to the VPS public IP before Certbot.

---

## 5) Redeploy after code changes

```bash
cd /var/www/securevista
bash scripts/deploy-vps.sh
```

---

## 6) Useful PM2 commands

```bash
pm2 status
pm2 logs securevista --lines 100
pm2 restart securevista
pm2 stop securevista
```

---

## Notes

- No database — pages come from TypeScript data modules.
- Quote form opens **WhatsApp** with the filled details.
- Raw `/images/` source library is not in Git; production uses `public/images/`.
- Local Windows start: `npm run build && set PORT=3005&& npm run start`
