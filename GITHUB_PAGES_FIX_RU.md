# Исправление сборки GitHub Pages

Предыдущая версия подключала собранный AMLL Core напрямую из папки `vendor`.
Это могло ломать разрешение внутренних зависимостей пакета при Vite-сборке.

В этой версии:

1. Vite снова использует обычный пакет `@applemusic-like-lyrics/core` из `node_modules`.
2. Перед каждой сборкой запускается `scripts/patch-amll-animation.mjs`.
3. Скрипт меняет все `wordDe - 400` на `wordDe - 0` в ESM- и CJS-сборках AMLL Core.
4. Исправление beat-by-beat TTML в `src/modules/project/logic/ttml-parser.ts` сохранено.
5. Список зависимостей не менялся, поэтому `pnpm-lock.yaml` совместим с `--frozen-lockfile`.
