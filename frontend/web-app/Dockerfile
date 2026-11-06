# ---------- Build ----------
FROM node:24-slim AS build

WORKDIR /app

# VITE_* API URLs — se queman en el build del bundle (Vite las lee de
# process.env con mayor prioridad que los .env). Los defaults mantienen
# paridad con el entorno local de docker-compose (puertos 5000-5004);
# el pipeline de CD las sobrescribe con --build-arg segun el entorno.
ARG VITE_API_URL=http://localhost:5000/api
ARG VITE_JOBS_API_URL=http://localhost:5001/api
ARG VITE_CANDIDATES_API_URL=http://localhost:5002/api
ARG VITE_COMPANIES_API_URL=http://localhost:5003/api
ARG VITE_INTERVIEWS_API_URL=http://localhost:5004/api

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_JOBS_API_URL=$VITE_JOBS_API_URL
ENV VITE_CANDIDATES_API_URL=$VITE_CANDIDATES_API_URL
ENV VITE_COMPANIES_API_URL=$VITE_COMPANIES_API_URL
ENV VITE_INTERVIEWS_API_URL=$VITE_INTERVIEWS_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Runtime ----------
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
