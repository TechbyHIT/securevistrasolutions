/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: "securevista",
      cwd: __dirname,
      script: ".next/standalone/server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
        NEXT_PUBLIC_SITE_URL: "https://securevistasolutions.in",
        NEXT_PUBLIC_BUSINESS_NAME: "Secure Vista Solutions",
      },
    },
  ],
};
