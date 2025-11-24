#!/usr/bin/env bash

# Fail fast
set -euo pipefail

# ==============================
# CONFIGURATION
# ==============================
DATA_DIR="src/data"
TMP_DIR="/tmp/coupon_sort_tmp"

mkdir -p "$TMP_DIR"

FILE1="$DATA_DIR/couponbase1.gz"
FILE2="$DATA_DIR/couponbase2.gz"
FILE3="$DATA_DIR/couponbase3.gz"

echo "🔄 Starting coupon preprocessing..."
echo "📂 Data directory: $DATA_DIR"

# Choose sort binary (macOS: gsort; Linux: sort)
SORT_BIN="sort"
if command -v gsort >/dev/null 2>&1; then
  SORT_BIN="gsort"
fi


# ==============================
# 1. UNIQUE PER FILE
# ==============================
echo "Running per-file preprocessing in parallel..."
echo ""

TMP1="$TMP_DIR/1"
TMP2="$TMP_DIR/2"
TMP3="$TMP_DIR/3"

mkdir -p "$TMP1" "$TMP2" "$TMP3"

(
  echo "➡ unique1.txt (file1) ..."
  gzcat "$FILE1" | tr -d '\r' | awk '{print toupper($0)}' \
    | LC_ALL=C $SORT_BIN -u -S 2G -T "$TMP1" -o "$DATA_DIR/unique1.txt"
  echo "✔ Done unique1.txt"
) &

(
  echo "➡ unique2.txt (file2) ..."
  gzcat "$FILE2" | tr -d '\r' | awk '{print toupper($0)}' \
    | LC_ALL=C $SORT_BIN -u -S 2G -T "$TMP2" -o "$DATA_DIR/unique2.txt"
  echo "✔ Done unique2.txt"
) &

(
  echo "➡ unique3.txt (file3) ..."
  gzcat "$FILE3" | tr -d '\r' | awk '{print toupper($0)}' \
    | LC_ALL=C $SORT_BIN -u -S 2G -T "$TMP3" -o "$DATA_DIR/unique3.txt"
  echo "✔ Done unique3.txt"
) &

wait

echo ""
echo "Unique lists generated."
echo ""

# ==============================
# 2. FIND PROMOS IN ≥ 2 FILES
# ==============================
echo "Finding final valid promos..."

cat "$DATA_DIR/unique1.txt" "$DATA_DIR/unique2.txt" "$DATA_DIR/unique3.txt" \
  | LC_ALL=C $SORT_BIN -S 2G -T "$TMP_DIR" \
  | uniq -c \
  | awk '$1 >= 2 {print $2}' \
  > "$DATA_DIR/valid_promos.txt"

echo ""
echo "DONE! valid_promos.txt created at $DATA_DIR/valid_promos.txt"