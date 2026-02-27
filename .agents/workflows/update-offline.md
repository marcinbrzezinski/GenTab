---
description: aktualizacja wersji offline index-offline.html na podstawie index.html
---

# Aktualizacja wersji offline

Celem jest zsynchronizowanie `index-offline.html` z aktualną wersją `index.html`,
przy jednoczesnej zamianie CDN Tailwind na lokalny plik CSS i przebudowaniu `tailwind.min.css`.

## Kroki

1. Skopiuj zawartość `index.html` do `index-offline.html` w całości, zastępując plik.

2. W pliku `index-offline.html` zamień linię CDN Tailwind:
```html
<script src="https://cdn.tailwindcss.com"></script>
```
na lokalny arkusz CSS:
```html
<link rel="stylesheet" href="tailwind.min.css">
```

3. Przejrzyj `index-offline.html` i zamień wszystkie eventualne inline style lub `onmouseover`/`onmouseout` na ekwiwalentne Tailwind klasy, jeśli takie klasy zostały użyte w `index.html` z CDN i są potrzebne w wersji offline.

4. Przebuduj `tailwind.min.css` — uruchom skrypt skanujący `index-offline.html`:

```bash
./build-css.sh
```

Skrypt automatycznie:
- instaluje `tailwindcss@3` tymczasowo przez npm
- skanuje `index-offline.html` i generuje `tailwind.min.css` ze wszystkich użytych klas
- usuwa `node_modules`, `package.json` i pliki tymczasowe

> **Wymaganie:** Node.js z `npx` musi być dostępny w PATH.

5. Zweryfikuj, że `index-offline.html` działa poprawnie bez połączenia z internetem:
   - Otwórz plik bezpośrednio w Chrome/Edge (`file://`)
   - Wyłącz internet lub użyj DevTools → Network → Offline
   - Sprawdź czy panel kontrolny, suwaki i arkusz A4 wyglądają identycznie jak w `index.html`

6. Zaktualizuj datę rewizji w `README.adoc` (pole `:revdate:`).
