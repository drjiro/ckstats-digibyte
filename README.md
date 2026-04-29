# CK Stats

This project displays real-time and historical statistics for the CKPool Bitcoin mining pool using data from their API.

## Features

- Real-time pool statistics
- Historical data chart
- Responsive design with themed display
- User and worker information

## Technologies Used

- Next.js
- Tailwind CSS
- daisyUI
- Recharts
- TypeORM

## Deployment

1. Clone the repository (git clone https://github.com/mrv777/ckstats.git)
2. Install pnpm: `curl -fsSL https://get.pnpm.io/install.sh | bash`
3. Install packages if needed: `sudo apt install postgresql postgresql-contrib nodejs nginx`
4. Go to the directory: `cd ckstats`
5. Set up the environment variables in `.env`
  - Example:
   ```
   API_URL="https://solo.ckpool.org"
   DB_HOST="server"
   DB_PORT="port"
   DB_USER="username"
   DB_PASSWORD="password"
   DB_NAME="database"
   ```
   Replace `username`, `password`, `server`, `port`, `database` with your actual PostgreSQL credentials, server details, and database names.
   You can also set the DB_SSL to true if you want to use SSL and set the DB_SSL_REJECT_UNAUTHORIZED to true if you want to reject untrusted SSL certificates (like self-signed certificates).
   If PostgreSQL is running locally, you can make `DB_HOST` `/var/run/postgresql/` (which connects via a Unix socket).  The username and password are then ignored (authentication is done based on the Unix user connection to the socket).
   If ckpool is running locally you can make `API_URL` the path to the logs directory.  For example `/home/ckpool-testnet/solobtc/logs`.

6. If you are upgrading from an existing version: `pnpm store prune`
7. Install dependencies: `pnpm install`
8. Run database migrations: `pnpm migration:run`
9. Seed the database and test the connection: `pnpm seed`
10. Build the application: `pnpm build`
11. Start the production server: `pnpm start`
12. Set up cronjobs for regular updates:
   - Open the crontab editor: `crontab -e`
   - Add lines to run the scripts.  Example:
     ```
     */1 * * * * cd /path/to/your/project && /usr/local/bin/pnpm seed
     */1 * * * * cd /path/to/your/project && /usr/local/bin/pnpm update-users
     5 */2 * * * cd /path/to/your/project && /usr/local/bin/pnpm cleanup
     ```
   - Save and exit the editor
   
   These cronjobs will run the `seed` and `update-users` scripts every 1 minute to populate the database and clean up old statistics every 2 hours.


## Scripts

- `pnpm dev`: Start the development server
- `pnpm build`: Build the production application
- `pnpm start`: Start the production server
- `pnpm lint`: Run ESLint
- `pnpm lint:fix`: Run ESLint and fix issues
- `pnpm seed`: Save/Update pool stats to database
- `pnpm update-stats`: Update pool statistics #Currently not used
- `pnpm update-users`: Update user and worker information
- `pnpm cleanup`: Clean up old statistics
- `pnpm test`: Run tests
- `pnpm test:watch`: Run tests in watch mode
- `pnpm migration:run`: Run TypeORM database migrations
- `pnpm migration:run:skip`: Run TypeORM database migrations skipping the initial migration

## License

GPL-3.0 license

# ckstats-digibyte

Fork of [mrv777/ckstats](https://github.com/mrv777/ckstats) with patches for DigiByte (DGB) mining pool stats support.

## Changes from upstream

### 1. BigInt type fix for missing pool stats fields (`scripts/seed.ts`)
- `accepted`, `rejected`, `bestshare` fields return `null` when ckpool (ctubio fork) does not include them in `pool.status`
- Fixed by adding `?? 0` default and wrapping with `BigInt()` to match TypeORM entity type

### 2. diff field null handling (`scripts/seed.ts`)
- DigiByte ckpool does not output `diff` field in `pool.status`
- Fixed by adding `?? 0` default value

## Tested environment
- Ubuntu 22.04 LTS
- Node.js v18.20.8
- pnpm 10+
- PostgreSQL 14
- ckpool-digibyte (ctubio fork with DGB patches)

## Setup

### 1. Install dependencies
```bash
curl -fsSL https://get.pnpm.io/install.sh | bash
source ~/.bashrc
cd ckstats
pnpm install
```

### 2. Configure .env
```bash
cat > .env << 'ENV'
# ckpool logs directory
API_URL="/home/arkpool/ckpool/logs"

# PostgreSQL
DB_HOST="127.0.0.1"
DB_PORT="5432"
DB_USER="ckstats_user"
DB_PASSWORD="your_password"
DB_NAME="ckstats"
DB_SSL=false

# Display
SITE_NAME="ArkPool DGB SHA-256"
COIN="BTC"
ENV
```

### 3. Database setup
```bash
# Create DB user and database
sudo -u postgres psql << 'SQL'
CREATE USER ckstats_user WITH PASSWORD 'your_password';
CREATE DATABASE ckstats OWNER ckstats_user;
GRANT ALL PRIVILEGES ON DATABASE ckstats TO ckstats_user;
SQL

# Run migrations
pnpm migration:run
```

### 4. Seed and start
```bash
pnpm seed
pnpm update-users
pnpm build
pnpm start
```

### 5. Crontab for auto-update
PATH=/home/arkpool/.nvm/versions/node/v18.20.8/bin:/home/arkpool/.local/share/pnpm:/usr/local/bin:/usr/bin:/bin
*/1 * * * * cd /home/arkpool/ckstats && pnpm seed
*/1 * * * * cd /home/arkpool/ckstats && pnpm update-users
5 */2 * * * cd /home/arkpool/ckstats && pnpm cleanup

### 6. systemd service
```ini
[Unit]
Description=CKStats Web UI
After=network.target postgresql.service

[Service]
Type=simple
User=arkpool
WorkingDirectory=/home/arkpool/ckstats
ExecStart=/home/arkpool/.local/share/pnpm/pnpm start
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PATH=/home/arkpool/.nvm/versions/node/v18.20.8/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

[Install]
WantedBy=multi-user.target
```

## Notes
- Designed for use with [ckpool-digibyte](https://github.com/takaowada/ckpool-digibyte)
- Web UI accessible at `http://server-ip:3000`
- COIN setting uses "BTC" for address validation format compatibility

## Original
- https://github.com/mrv777/ckstats
