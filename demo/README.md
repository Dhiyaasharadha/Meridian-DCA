# MERIDIAN DCA — Demo & Recording Assets

This folder contains pre-recording checklists, demonstration assets, fallback guides, and media artifacts for the Meridian DCA hackathon submission.

---

## 📁 Subdirectory Structure

- `screenshots/`: Store high-resolution 1080p screen captures of Landing, Create Strategy, Dashboard, Decision Log, and Metrics pages.
- `recording/`: Store final MP4 demo video recordings and voiceover tracks.

---

## 📋 Pre-Recording Health & Environment Checklist

Run the following checks before starting any demo recording session:

1. **Anvil RPC Health**: `curl -X POST http://127.0.0.1:8545 -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'`
2. **Backend API Health**: `curl http://localhost:4000/health` (Expect `status: "ok"`)
3. **Frontend Build Check**: `npm run build` in `frontend/` directory (Expect `✓ Generating static pages 8/8`)
4. **Active Strategy State**: `curl http://localhost:4000/demo/state/1`
