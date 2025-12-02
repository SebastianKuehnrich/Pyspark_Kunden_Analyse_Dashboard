# ⚠️ RAILWAY DEPLOYMENT - WICHTIGE KONFIGURATION

## Frontend Service muss Root Directory setzen!

Das Frontend nutzt gerade die **FALSCHE** nixpacks.toml (Root statt Frontend-spezifisch).

### Lösung:

1. **Railway Dashboard** öffnen
2. **Frontend Service** auswählen
3. **Settings** → **Root Directory** → `frontend` eingeben
4. **Redeploy** triggern

### Warum?

Das Frontend-Service versucht gerade:
- ❌ Python + pip zu installieren (nicht nötig für Frontend!)
- ❌ Backend-Dependencies zu installieren
- ❌ Gunicorn zu starten (statt Vite Preview)

Mit `Root Directory = frontend` nutzt Railway automatisch:
- ✅ `frontend/nixpacks.toml` (nur Node.js)
- ✅ `frontend/package.json`
- ✅ Kein Python/Backend-Zeug

### Alternative: Separate Repositories (Empfohlen für Production)

**Aktuell:**
- Backend: Eigenes Repo ✅
- Frontend: Im Monorepo (kompliziert für Railway)

**Besser:**
- Frontend in eigenes Repository verschieben
- Jedes Service hat eigene, saubere Config

---

Nach dem Fix sollte das Frontend-Build so aussehen:
```
setup      │ nodejs_20
install    │ npm ci
build      │ npm run build
start      │ npm run preview
```

KEIN Python, kein pip, kein gunicorn!

