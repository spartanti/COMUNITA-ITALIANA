FROM node:20-slim

# Install pnpm globally
RUN npm install -g pnpm@9

WORKDIR /app

# Copy workspace config files first (dependency layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.base.json tsconfig.json ./
COPY lib/db/ ./lib/db/
COPY lib/api-zod/ ./lib/api-zod/
COPY lib/api-client-react/ ./lib/api-client-react/
COPY lib/object-storage-web/ ./lib/object-storage-web/
COPY lib/api-spec/ ./lib/api-spec/
COPY artifacts/api-server/ ./artifacts/api-server/
COPY artifacts/comunitaes/ ./artifacts/comunitaes/
COPY scripts/ ./scripts/
COPY attached_assets/ ./attached_assets/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build TypeScript libs
RUN pnpm run typecheck:libs

# Build frontend (React/Vite)
ENV BASE_PATH=/
ENV PORT=3000
RUN pnpm --filter @workspace/comunitaes run build

# Build API server (esbuild bundle)
RUN pnpm --filter @workspace/api-server run build

EXPOSE 8080

ENV NODE_ENV=production

# Run DB migrations then start server
CMD pnpm --filter @workspace/db run push && \
    node --enable-source-maps ./artifacts/api-server/dist/index.mjs
