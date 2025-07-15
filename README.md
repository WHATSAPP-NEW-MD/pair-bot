
# Deploy Ready WhatsApp Bot + Pair Site

✅ Node.js Baileys bot + Express pairing code site with multi deploy support.

## Localhost
```bash
npm install
npm run start-all
```
Visit http://localhost:3000/pair

## Render.com
Has `render.yaml` for automatic deploy.

## Docker
```bash
docker-compose up --build
```

## pm2
```bash
pm2 start ecosystem.config.js
```
