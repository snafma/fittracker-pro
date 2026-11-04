#!/bin/bash
# Controllo sintassi + test funzionali su sorgente e su index.html minificato
cd "$(dirname "$0")"
for f in Index-SORGENTE.html ../index.html; do
  echo "== $f"; bash chk.sh "$f"
  for t in smoke regr feat68 feat69 feat70 feat71 feat72 feat73 feat74 feat75 feat76 feat78; do
    printf "%-8s " $t; node $t.js "$f" 2>&1 | grep -v 'SW\]' > /tmp/ft_t.txt
    echo "ok=$(grep -c '✓\|SMOKE OK' /tmp/ft_t.txt) fail=$(grep -c 'FAIL\|✗' /tmp/ft_t.txt)"; grep FAIL /tmp/ft_t.txt | head -3
  done
done
