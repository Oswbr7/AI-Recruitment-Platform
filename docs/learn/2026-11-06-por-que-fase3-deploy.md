# Aprendizaje — Por qué el deploy se diseñó así (CI/CD Fase 3, 2026-11-06)

> Documento educativo complementario a `docs/sessions/2026-11-06-tests-fase3-deploy.md`.
> Conceptos: GitHub Environments como barrera humana, tags inmutables como disparador de producción, render-then-patch vs mutación de manifiestos, y verificación local de lo que un pipeline hará.

---

## 1. Environments de GitHub: el approval como parte del pipeline, no del proceso

Cuando se acordó "push→staging, tag→prod", la pieza que conecta esa estrategia con la seguridad es el **GitHub Environment**: un job que declara `environment: production` se *congela* antes de ejecutar hasta que un revisor (configurado en Settings → Environments) lo aprueba desde la UI de GitHub. La barrera humana no vive en un documento ni en una costumbre ("pregunta antes de deployear a prod") — vive en el pipeline mismo: nadie puede saltársela sin cambiar el YAML, y ese cambio queda en el historial.

Detalles que lo hacen sólido:

- **Secrets por ambiente**: `KUBECONFIG_STAGING` y `KUBECONFIG_PRODUCTION` son secrets *distintos* conectados a su environment. El job de staging físicamente no puede leer el secret de producción — el aislamiento de credenciales es estructural, no de convención.
- **El job de staging no tiene reviewers**: el camino feliz (push a main → staging) no exige humanos; la fricción solo existe donde el riesgo lo justifica. Es la versión pipeline de "seguro por defecto, excepción deliberada".

## 2. Tag `v*` como disparador: producción apunta a algo inmutable

¿Por qué un tag y no una rama `release/x`? Porque una rama es un puntero móvil: `release/1.0` puede avanzar, recibir cherry-picks, reescribirse. Un tag `v1.2.0` apunta a **un commit y siempre a ese commit**. Desplegar "el tag" significa desplegar algo cuyo contenido es resoluble con `git show v1.2.0` — hoy y dentro de un año.

Y como en la Fase 1 las imágenes también se etiquetan por SHA, la cadena queda cerrada:

```
tag v1.2.0  →  commit abc123  →  imágenes :abc123  →  manifiesto apunta a :abc123
```

Cada eslabón referencia al anterior por un identificador inmutable. El rollback deja de ser una operación de emergencia y pasa a ser *redeploy de un SHA que ya existe*.

## 3. Render-then-patch: aplicar el tag SHA sin mutar el repo

La alternativa obvia a "fijar la imagen en el manifiesto" era `kustomize edit set image` sobre el overlay commiteado. Funciona, pero exige instalar el CLI de kustomize en el runner y **modifica archivos** (aunque sea en el checkout del job). El enfoque elegido es más simple y más inspeccionable:

```bash
kubectl kustomize overlays/staging \
  | sed -E "s|ghcr.io/CHANGE_ME/ai-recruitment/([a-z-]+):latest|ghcr.io/$OWNER/ai-recruitment/\1:$SHA|g" \
  > rendered.yaml
kubectl apply -f rendered.yaml
```

- **Declarativo hasta el final**: el pipeline produce el YAML exacto que aplica, y ese YAML queda en los logs del job — un `grep image:` enseña qué se desplegó sin necesidad de cluster.
- **El placeholder `CHANGE_ME` se convierte en característica**: marca inequívoca de "esto lo sustituye el pipeline"; un apply a mano sin sustituir fallaría de forma evidente (imagen inexistente) en vez de desplegar algo silenciosamente viejo.
- **Verificable localmente sin cluster**: esta sesión ejecutó exactamente ese pipe contra ambos overlays y comprobó las 6 sustituciones — la parte mecánica del deploy está probada; lo que falta (la corrida real) es solo disponibilidad de un cluster, no más diseño.

## 4. Los Jobs de migración otra vez: la inmutabilidad se gestiona, no se ignora

La Fase 2 documentó que los Jobs son inmutables y que reaplicar requiere borrarlos antes. El pipeline no puede permitirse fallar por eso, así que el paso "Reset Jobs de migración" (`kubectl delete job ... --ignore-not-found`) está **dentro** del workflow, no en la memoria de quien lo ejecuta. Es un patrón general: **todo paso manual documentado en un README es un bug de pipeline esperando ocurrir** — si el deploy lo necesita, el deploy lo hace.

## 5. Verificación en ausencia de infraestructura

Esta sesión no pudo ejecutar Docker ni crear un cluster, y aun así quedó verificado todo lo verificable:

| Capa | Cómo se verificó |
|---|---|
| Sintaxis del workflow | YAML parseado con js-yaml (triggers, jobs, environments) |
| Lógica de sustitución de imágenes | El pipe `kustomize \| sed` ejecutado localmente contra staging y production |
| Modelo del render | `kubectl kustomize` ya validado en la Fase 2 |
| Lo que falta | Solo la corrida real: necesita cluster + secrets |

La disciplina es la misma de siempre en este proyecto: separar "lo que depende de infraestructura" de "lo que no", y verificar todo lo segundo antes de pedir lo primero. Cuando el cluster exista, la sesión de smoke test encontrará un pipeline cuya mecánica ya fue ejercitada, no escrita por primera vez bajo presión.

## 6. Resumen de conceptos

| Concepto | Dónde se vio |
|---|---|
| Environments = approvals + secrets aislados por ambiente | `environment: staging/production`, secrets `KUBECONFIG_*` |
| Tag inmutable como disparador de prod | `on.push.tags: ["v*"]` + imágenes por SHA |
| Cadena de identidad commit→imagen→manifiesto | SHA referenciado en cada eslabón |
| Render-then-patch (sin mutar el repo, sin CLI extra) | `kubectl kustomize \| sed \| apply` |
| El placeholder como característica de seguridad | `CHANGE_ME` falla evidente si no se sustituye |
| Pasos manuales documentados → pasos del pipeline | Reset de Jobs de migración dentro del workflow |
| Verificar lo verificable sin infra | Simulación local del pipe de despliegue |
