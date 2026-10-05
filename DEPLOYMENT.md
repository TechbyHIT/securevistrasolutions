# Deployment (VPS + PM2 + Nginx)

Production stack for **Secure Vista Solutions**:

- Domain: `https://securevistasolutions.in`
- App port: **3003** (behind Nginx)
- Process manager: **PM2**
- Next.js `output: "standalone"` (no Docker)

Repo: https://github.com/TechbyHIT/securevistrasolutions.git

---

## Sitemaps (build-time, Deva pattern)

Build writes static files (not Next `app/sitemap.ts`):

- `public/sitemap.xml` — index
- `public/sitemaps/sitemap-N.xml` — shards (max 40k URLs each)

```bash
npm run catalog:build   # verify static TS catalog
npm run sitemap:build   # write public/sitemap*.xml
npm run build           # catalog → sitemap → next build
```

Low-RAM VPS: `SITEMAP_PHASE=1 bash scripts/deploy-vps.sh` (hubs + menu services only).

## Selective static generation (Hyderabad priority)

`generateStaticParams()` on `/[locationSlug]/` pre-renders **priority** Hyderabad pages only (services × city + top localities for invisible-grills installation).

- `dynamicParams = true` — all other **valid** pages still return HTTP 200 via ISR (`revalidate = 86400`)
- Sitemap / robots / indexability are **independent** of the static list
- Source: `src/lib/seo/priority-seo-pages.ts`

```bash
npm run seo:validate
```

## Full one-command setup (recommended)

On a fresh Ubuntu/Debian VPS (with sudo):

```bash
# Option A — clone then bootstrap
sudo apt-get update -y && sudo apt-get install -y git
git clone https://github.com/TechbyHIT/securevistrasolutions.git /tmp/securevista-setup
bash /tmp/securevista-setup/scripts/vps-bootstrap.sh
```

This installs Node 20, PM2, Nginx, UFW, clones to `/var/www/securevista`, builds standalone, starts PM2 on **port 3003**, configures Nginx for `securevistasolutions.in`, and attempts Let's Encrypt SSL.

**Before SSL works:** point DNS A records for `@` and `www` to the VPS IP.

---

## Manual setup (step by step)

### 1) Prerequisites

```bash
sudo apt update
sudo apt install -y git nginx certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm i -g pm2
```

### 2) Clone & env

```bash
sudo mkdir -p /var/www && sudo chown -R "$USER":"$USER" /var/www
cd /var/www
git clone https://github.com/TechbyHIT/securevistrasolutions.git securevista
cd securevista
cp .env.example .env
nano .env
```

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
PORT=3003
```

### 3) Build + PM2

```bash
chmod +x scripts/deploy-vps.sh scripts/vps-bootstrap.sh
bash scripts/deploy-vps.sh
curl -I http://127.0.0.1:3003
```

### 4) Nginx + SSL

Use the site file created by `vps-bootstrap.sh`, or see `scripts/vps-bootstrap.sh` for the Nginx template, then:

```bash
sudo certbot --nginx -d securevistasolutions.in -d www.securevistasolutions.in
```

### 5) Redeploy later

```bash
cd /var/www/securevista
bash scripts/deploy-vps.sh
```

### Useful PM2

```bash
pm2 status
pm2 logs securevista --lines 100
pm2 restart securevista
```

---

## Notes

- No database — TypeScript data modules only.
- Quote form sends to **WhatsApp**.
- Raw `/images/` source is not in Git; production uses `public/images/`.
- Local Windows: `npm run build && set PORT=3003&& npm run start`
