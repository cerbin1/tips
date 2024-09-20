1. Copy `.env_template` to `.env`
2. Go to docs.hcaptcha.com, and put sitekey to `VITE_HCAPTCHA_SITE_KEY`

3. Run PostgreSQL, rabbitMq and Mongo:
   ```
   docker run --rm -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=afterady postgres:latest
   docker run --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management
   docker run --rm -p 27017:27017 -e MONGO_INITDB_DATABASE=afterady mongo:latest
   ```
4. Add records to `role` table:
   - `id:generated`, `role`:`ROLE_ADMIN`
   - `id:generated`, `role`:`ROLE_USER`
5. Run front
   ```
   yarn install
   yarn dev
   ```
6. Run backend application with environment variables:
   ```
   AFTERADY_FRONT_URL=http://localhost:5173/
   AFTERADY_CAPTCHA_SECRET=0x0000000000000000000000000000000000000000
   ```
7. Open http://localhost:5173/
