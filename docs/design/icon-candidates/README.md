# Icon candidates (Ridgeway)

Made 22 Sep 2026 with SnapAI. Logo is dark green near `#1A3636`. Background we shipped is `#D6BD98` (SnapAI drew a close beige; we corrected it).

Options:

- `01.png` — mountain + skyline bars (**this one shipped**)
- `02.png` — flat stepped ridges with wave tops
- `03.png` — single 3D winding ridge peak

Files in the app:

- `apps/mobile-app/assets/icons/icon.png` — logo on the solid background
- `apps/mobile-app/assets/icons/icon-foreground.png` — logo only (clear around it); splash + BrandMark + iOS layer
- `apps/mobile-app/assets/icons/splash-icon.png` — same as `icon-foreground.png` (transparent; Expo paints `#D6BD98` behind it)
- `apps/mobile-app/assets/icons/adaptive-icon.png` — **Android adaptive** foreground only (mark shrunk into the safe zone so round launchers do not clip it)
- `apps/mobile-app/assets/icons/ridgeway.icon` — iOS icon package
- `apps/web-app/public/icons/logo.png` — same transparent mark for web chrome
- `apps/web-app/public/icons/app-icon.png` and `apps/web-app/app/icon.png` — mark on gold (browser tab)
- In-app chrome: mobile `BrandMark` and web `BrandMark` use the transparent logo beside / above the wordmark

How to do this on the next job: studio `project-template/docs/client-delivery/app-icon-with-snapai.md`.
