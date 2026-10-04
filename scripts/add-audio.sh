#!/usr/bin/env bash
#
# add-audio.sh — lay your own audio (music, voiceover, ambience) onto the
# already-silent intro/footer video, matching the video's length exactly.
#
# - Audio SHORTER than the video is looped to fill it.
# - Audio LONGER than the video is trimmed down to it.
# - Fades the audio in/out so it doesn't cut abruptly (matches the video's
#   own 0.7s in / 0.8s out visual fade).
# - Replaces the target video in place (public/assets/*.mp4).
#
# USAGE (run from the project root, e.g. `cd raghunath-portfolio`):
#   scripts/add-audio.sh <target> <path-to-your-audio>
#
# TARGETS:
#   intro    -> public/assets/intro-video.mp4
#   footer   -> public/assets/footer-video.mp4
#
# OPTIONS:
#   --start N     start reading the audio N seconds in (skip an intro/lead-in
#                 in your file, e.g. a song's verse before the chorus)
#   --volume N    volume multiplier, default 0.85 (1.0 = original level,
#                 0.5 = half volume, 1.5 = louder)
#   --no-fade     disable the in/out audio fade
#
# EXAMPLES:
#   scripts/add-audio.sh intro  ~/Music/background-track.mp3
#   scripts/add-audio.sh intro  ~/Music/song.mp3 --start 12 --volume 0.7
#   scripts/add-audio.sh footer ~/Audio/voiceover.wav --no-fade
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
AUDIO="${2:-}"
START=0
VOLUME=0.85
FADE=true

shift 2 2>/dev/null || true
while [ $# -gt 0 ]; do
  case "$1" in
    --start)    START="$2"; shift 2 ;;
    --volume)   VOLUME="$2"; shift 2 ;;
    --no-fade)  FADE=false; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

if [ -z "$TARGET" ] || [ -z "$AUDIO" ]; then
  echo "Usage: scripts/add-audio.sh <target> <path-to-your-audio> [--start N] [--volume N] [--no-fade]"
  echo "Targets: intro, footer  (see header of this script for full docs)"
  exit 1
fi

if [ ! -f "$AUDIO" ]; then
  echo "Audio file not found: $AUDIO"
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ASSETS="$ROOT/public/assets"

case "$TARGET" in
  intro)  VIDEO="$ASSETS/intro-video.mp4" ;;
  footer) VIDEO="$ASSETS/footer-video.mp4" ;;
  *)
    echo "Unknown target: $TARGET (expected: intro, footer)"
    exit 1
    ;;
esac

if [ ! -f "$VIDEO" ]; then
  echo "Video not found: $VIDEO"
  exit 1
fi

DURATION="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO")"
FADE_OUT_START="$(python3 -c "print(max(0, $DURATION - 0.8))")"

echo "Target video : $VIDEO  (${DURATION}s)"
echo "Audio source : $AUDIO  (start offset: ${START}s, volume: ${VOLUME}x)"

AUDIO_FILTER="atrim=start=${START},asetpts=PTS-STARTPTS,volume=${VOLUME}"
if $FADE; then
  AUDIO_FILTER="${AUDIO_FILTER},afade=t=in:st=0:d=0.7,afade=t=out:st=${FADE_OUT_START}:d=0.8"
fi

TMP="$(mktemp --suffix=.mp4)"

# -stream_loop -1 loops the audio input indefinitely; combined with -shortest
# (bounded by the video, which is mapped second) this safely covers both the
# "audio shorter than video" and "audio longer than video" cases.
ffmpeg -y -loglevel error \
  -stream_loop -1 -i "$AUDIO" \
  -i "$VIDEO" \
  -filter_complex "[0:a]${AUDIO_FILTER}[a]" \
  -map 1:v -map "[a]" \
  -c:v copy -c:a aac -b:a 192k \
  -t "$DURATION" \
  -movflags +faststart \
  "$TMP"

mv "$TMP" "$VIDEO"

echo "Done. $(basename "$VIDEO") now has your audio."
echo "Refresh your dev server (or restart 'npm run dev') to hear it."
