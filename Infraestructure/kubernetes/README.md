# Kubernetes — AI Recruitment Platform

Manifiestos de la plataforma: **Kustomize** (`base/` + overlays `staging`/`production`),
Postgres en un StatefulSet (decisión de aprendizaje — en producción real, base
gestionada), un Job de migraciones por servicio (EF migrations bundle, ver
`docs/architecture.md` §9) y un **nginx Ingress como gateway único**.

## Estructura

```
kubernetes/
├── base/                    # recursos comunes (sin namespace, sin secretos)
│   ├── postgres/            # StatefulSet + Service + ConfigMap init-db
│   ├── auth-service.yaml    # Deployment + Service + Job de migración
│   ├── job-service.yaml     #   (idem para los 5 servicios)
│   ├── candidate-service.yaml
│   ├── company-service.yaml
│   ├── interview-service.yaml
│   ├── frontend.yaml        # Deployment + Service
│   └── ingress.yaml         # gateway: recruitment.local -> /api/* + frontend
├── overlays/
│   ├── staging/             # namespace recruitment-staging, tag latest
│   └── production/          # namespace recruitment, tag fijado por CD (SHA)
├── secrets/                 # cómo crear recruitment-secrets (NO versionar)
├── kind-config.yaml         # cluster local de práctica
└── README.md
```

## Puesta en marcha en kind (cluster local)

Prerequisitos: Docker, [kind](https://kind.sigs.k8s.io/), kubectl.

```bash
# 1. Cluster
kind create cluster --config kind-config.yaml

# 2. Ingress controller (el de kind, con el node-label del config)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

# 3. DNS local
echo "127.0.0.1 recruitment.local" | sudo tee -a /etc/hosts   # Windows: C:\Windows\System32\drivers\etc\hosts

# 4. Secretos (una sola vez por namespace)
#    Ver secrets/README.md — requiere POSTGRES_PASSWORD, JWT_KEY (>=32 chars)
#    y los 5 connection strings.

# 5. Imágenes locales con el bundle de migraciones incluido
#    (las imágenes publicadas por cd.yml ya lo llevan; para kind sin GHCR,
#    construir local y cargar al cluster)
for svc in auth-service job-service candidate-service company-service interview-service; do
  docker build -f services/$svc/Dockerfile -t ghcr.io/CHANGE_ME/ai-recruitment/$svc:latest .
done
#    Frontend: build-args con la URL del gateway (mismo origen -> sin CORS)
docker build \
  --build-arg VITE_API_URL=http://recruitment.local/api \
  --build-arg VITE_JOBS_API_URL=http://recruitment.local/api \
  --build-arg VITE_CANDIDATES_API_URL=http://recruitment.local/api \
  --build-arg VITE_COMPANIES_API_URL=http://recruitment.local/api \
  --build-arg VITE_INTERVIEWS_API_URL=http://recruitment.local/api \
  -t ghcr.io/CHANGE_ME/ai-recruitment/frontend:latest frontend/web-app

for img in auth-service job-service candidate-service company-service interview-service frontend; do
  kind load docker-image ghcr.io/CHANGE_ME/ai-recruitment/$img:latest
done

# 6. Cambiar el placeholder del owner en el overlay
sed -i 's|CHANGE_ME|<tu-github-user>|' Infraestructure/kubernetes/overlays/staging/kustomization.yaml

# 7. Aplicar
kubectl apply -k Infraestructure/kubernetes/overlays/staging
```

## Orden de arranque y migraciones

`kubectl apply -k` crea todo en un paso y **no garantiza orden**. Lo que
ocurre y por qué es seguro:

1. Los **Jobs de migración** arrancan apenas Postgres está listo; aplican
   el esquema con `/app/migrate` (el bundle EF de cada imagen).
2. Los **Deployments** de los servicios pueden arrancar antes de que el
   esquema exista: sus `readinessProbe` (`/health/ready`, que incluye
   chequeo de Postgres) fallan y los pods se reinician hasta que el
   esquema está aplicado — se recuperan solos, sin intervención.

Verificación:

```bash
kubectl -n recruitment-staging get jobs                          # migraciones: COMPLETE
kubectl -n recruitment-staging logs job/auth-service-db-migrate  # log del bundle
kubectl -n recruitment-staging get pods                          # Deployments: 1/1 Ready
kubectl -n recruitment-staging port-forward svc/auth-service 5000:80 &
curl localhost:5000/health/ready
```

**Reaplicar migraciones** (los Jobs son inmutables — `kubectl apply` falla
si el Job ya existe con distinta especificación):

```bash
kubectl -n recruitment-staging delete job auth-service-db-migrate --ignore-not-found
kubectl apply -k Infraestructure/kubernetes/overlays/staging
```

## El gateway (ingress)

El navegador solo habla con `http://recruitment.local`:

| Path | Destino |
|---|---|
| `/api/auth`, `/api/users` | auth-service |
| `/api/jobs` | job-service |
| `/api/candidates` | candidate-service |
| `/api/companies` | company-service |
| `/api/interviews` | interview-service |
| `/*` (catch-all) | frontend (SPA) |

Como frontend y APIs comparten origen, **CORS deja de ser necesario** en
este esquema (el valor `Cors__AllowedOrigins__0` se mantiene por si se
sirve el frontend desde otro origen).

## Decisiones y límites conscientes (para aprendizaje)

- **Postgres en StatefulSet dentro del clúster**: simple y didáctico. En
  producción real usar una base gestionada (RDS/Cloud SQL) — el resto de
  los manifiestos no cambia (solo el Service/connection strings).
- **Secrets manuales** con `kubectl create secret`: suficiente para kind.
  Producción real: External Secrets Operator o Sealed Secrets.
- **Tag `:latest` en staging**: aceptable mientras staging sigue la punta
  de main. Producción: el CD fija tags SHA (ver overlay production).
- **Migraciones como Job aplicado con el resto**: suficiente para
  aprender. Evolución natural: Helm hooks o un orquestador (Argo CD).
- **Un solo nodo en kind**: los `PodDisruptionBudget`/anti-affinity y las
  réplicas >1 quedan para cuando haya un clúster real.
