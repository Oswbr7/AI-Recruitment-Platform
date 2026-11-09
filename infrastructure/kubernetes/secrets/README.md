# Secretos de la plataforma — NUNCA versionar valores reales.

Los manifiestos de `base/` esperan un Secret llamado `recruitment-secrets`
con las claves definidas en `recruitment-secrets.example.yaml`. Crearlo es
un paso manual por ambiente (una sola vez por namespace):

```bash
NAMESPACE=recruitment-staging   # o recruitment para production

kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic recruitment-secrets \
  -n "$NAMESPACE" \
  --from-literal=POSTGRES_PASSWORD='cambia-esto' \
  --from-literal=JWT_KEY='minimo-32-caracteres-sino-falla-el-arranque' \
  --from-literal=JWT_ISSUER='RecruitmentPlatform' \
  --from-literal=JWT_AUDIENCE='RecruitmentPlatform' \
  --from-literal=AUTH_CONNECTION_STRING='Host=postgres;Port=5432;Database=recruitmentdb;Username=postgres;Password=cambia-esto' \
  --from-literal=JOBS_CONNECTION_STRING='Host=postgres;Port=5432;Database=jobservicedb;Username=postgres;Password=cambia-esto' \
  --from-literal=CANDIDATES_CONNECTION_STRING='Host=postgres;Port=5432;Database=candidatedb;Username=postgres;Password=cambia-esto' \
  --from-literal=COMPANIES_CONNECTION_STRING='Host=postgres;Port=5432;Database=companydb;Username=postgres;Password=cambia-esto' \
  --from-literal=INTERVIEWS_CONNECTION_STRING='Host=postgres;Port=5432;Database=interviewdb;Username=postgres;Password=cambia-esto'
```

Notas:

- `JWT_KEY` debe tener **minimo 32 caracteres**: los `JwtOptions` validan
  con `ValidateOnStart()` y la app falla en el arranque si no cumple
  (fail-fast, ver docs/architecture.md §8).
- El secreto JWT es **compartido por los 5 servicios** (mismo emisor y
  firma HS256, validacion local — §5 de architecture.md). Cuando haya un
  Identity Provider centralizado, esto se sustituye.
- Para produccion real considerar External Secrets Operator / Sealed
  Secrets en lugar de secrets creados a mano. Para el cluster de
  aprendizaje (kind) esto es suficiente.
- `recruitment-secrets.example.yaml` existe solo como referencia de la
  forma del Secret; aplicarlo tal cual crearia credenciales de mentira.
