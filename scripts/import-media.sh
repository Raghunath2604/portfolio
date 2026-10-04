#!/usr/bin/env bash
#
# import-media.sh — drop your own photos/videos into the right portfolio slots.
#
# Crops each file to the exact size the site expects (center-crop, no
# stretching/distortion) and saves it under the correct filename in
# public/assets/, so you never have to touch any component code.
#
# USAGE (run from the project root, e.g. `cd raghunath-portfolio`):
#   scripts/import-media.sh <target> <path-to-your-file>
#
# TARGETS:
#   education      -> public/assets/education-bg.webp     (1600x1200 image)
#   project1       -> public/assets/project-1.png          (1600x1000 image)
#   project2       -> public/assets/project-2.png          (1600x1000 image)
#   project3       -> public/assets/project-3.png          (1600x1000 image)
#   mobile-footer  -> public/assets/mobile-footer-bg.webp  (900x1600 image)
#   intro          -> public/assets/intro-video.mp4        (1280x720 video)
#   footer-video   -> public/assets/footer-video.mp4       (1280x720 video)
#
# EXAMPLES:
#   scripts/import-media.sh education ~/Pictures/desk-setup.jpg
#   scripts/import-media.sh project1  ~/Pictures/mlflow-dashboard.png
#   scripts/import-media.sh intro     ~/Videos/intro-take3.mov
#
# Video options:
#   --seconds N   trim output to the first N seconds
#   --mute        strip audio (video targets keep original audio by default)
#
# Requires: ffmpeg (https://ffmpeg.org — brew install ffmpeg / apt install ffmpeg /
#           winget install ffmpeg)

set -euo pipefail

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required but not found. Install it and re-run:"
  echo "  macOS:   brew install ffmpeg"
  echo "  Ubuntu:  sudo apt install ffmpeg"
  echo "  Windows: winget install ffmpeg"
  exit 1
fi

TARGET="${1:-}"
SRC="${2:-}"
SECONDS_OPT=""
MUTE=false

shift 2 2>/dev/null || true
while [ $# -gt 0 ]; do
  case "$1" in
    --seconds) SECONDS_OPT="$2"; shift 2 ;;
    --mute)    MUTE=true; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

if [ -z "$TARGET" ] || [ -z "$SRC" ]; then
  echo "Usage: scripts/import-media.sh <target> <path-to-your-file> [--seconds N] [--mute]"
  echo "Run with no arguments to see the full target list and examples (see header of this script)."
  exit 1
fi

if [ ! -f "$SRC" ]; then
  echo "File not found: $SRC"
  exit 1
fi

# project root = parent of this script's directory
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ASSETS="$ROOT/public/assets"
mkdir -p "$ASSETS"

case "$TARGET" in
  education)     OUT="$ASSETS/education-bg.webp";      W=1600; H=1200; TYPE=image ;;
  project1)      OUT="$ASSETS/project-1.png";          W=1600; H=1000; TYPE=image ;;
  project2)      OUT="$ASSETS/project-2.png";          W=1600; H=1000; TYPE=image ;;
  project3)      OUT="$ASSETS/project-3.png";          W=1600; H=1000; TYPE=image ;;
  mobile-footer) OUT="$ASSETS/mobile-footer-bg.webp";  W=900;  H=1600; TYPE=image ;;
  intro)         OUT="$ASSETS/intro-video.mp4";        W=1280; H=720;  TYPE=video ;;
  footer-video)  OUT="$ASSETS/footer-video.mp4";       W=1280; H=720;  TYPE=video ;;
  *)
    echo "Unknown target: $TARGET"
    echo "Valid targets: education, project1, project2, project3, mobile-footer, intro, footer-video"
    exit 1
    ;;
esac

# Center-crop-to-fill filter: scale up until it covers WxH, then crop the excess.
CROP_FILTER="scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}"

echo "Importing '$SRC' -> '$OUT' (${W}x${H})..."

if [ "$TYPE" = "image" ]; then
  TMP="$(mktemp).png"
  ffmpeg -y -loglevel error -i "$SRC" -vf "$CROP_FILTER" -frames:v 1 "$TMP"
  case "$OUT" in
    *.webp) ffmpeg -y -loglevel error -i "$TMP" -c:v libwebp -quality 90 "$OUT" ;;
    *.png)  cp "$TMP" "$OUT" ;;
    *)      ffmpeg -y -loglevel error -i "$TMP" "$OUT" ;;
  esac
  rm -f "$TMP"
else
  TRIM_ARGS=()
  [ -n "$SECONDS_OPT" ] && TRIM_ARGS=(-t "$SECONDS_OPT")

  AUDIO_ARGS=(-c:a aac -b:a 128k)
  $MUTE && AUDIO_ARGS=(-an)

  ffmpeg -y -loglevel error -i "$SRC" "${TRIM_ARGS[@]}" \
    -vf "$CROP_FILTER,fps=24" \
    -c:v libx264 -pix_fmt yuv420p -movflags +faststart \
    "${AUDIO_ARGS[@]}" \
    "$OUT"
fi

echo "Done. Saved to public/assets/$(basename "$OUT")"
echo "Refresh your dev server (or restart 'npm run dev') to see it."
