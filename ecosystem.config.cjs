const path = require("path");

/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: "securevista",
      cwd: path.join(__dirname, ".next", "standalone"),
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "512M",
      autorestart: true,
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: "3005",
        HOSTNAME: "0.0.0.0",
        NEXT_PUBLIC_SITE_URL: "https://securevistasolutions.in",
        NEXT_PUBLIC_BUSINESS_NAME: "Secure Vista Solutions",
        NEXT_PUBLIC_LEGAL_BUSINESS_NAME: "Secure Vista Solutions",
        NEXT_PUBLIC_BUSINESS_EMAIL: "securevista1@gmail.com",
        NEXT_PUBLIC_PHONE_DISPLAY: "+91 95020 96677",
        NEXT_PUBLIC_PHONE_RAW: "+919502096677",
        NEXT_PUBLIC_WHATSAPP_DISPLAY: "+91 95020 96677",
        NEXT_PUBLIC_WHATSAPP_RAW: "919502096677",
      },
    },
  ],
};
