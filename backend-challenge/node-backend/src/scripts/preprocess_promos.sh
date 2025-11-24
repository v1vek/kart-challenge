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

echo "🔧 Using sort executable: $SORT_BIN"
echo "📁 Temporary directory: $TMP_DIR"
echo ""

# ==============================
# 1. UNIQUE PER FILE
# ==============================
echo "➡ Generating unique1.txt..."
gzcat "$FILE1" | tr -d '\r' | awk '{print toupper($0)}' \
  | LC_ALL=C $SORT_BIN -u -S 4G -T "$TMP_DIR" -o "$DATA_DIR/unique1.txt"

echo "➡ Generating unique2.txt..."
gzcat "$FILE2" | tr -d '\r' | awk '{print toupper($0)}' \
  | LC_ALL=C $SORT_BIN -u -S 4G -T "$TMP_DIR" -o "$DATA_DIR/unique2.txt"

echo "➡ Generating unique3.txt..."
gzcat "$FILE3" | tr -d '\r' | awk '{print toupper($0)}' \
  | LC_ALL=C $SORT_BIN -u -S 4G -T "$TMP_DIR" -o "$DATA_DIR/unique3.txt"

echo ""
echo "Unique lists generated."
echo ""


# ==============================
# 2. FIND PROMOS IN ≥ 2 FILES
# ==============================
echo "Finding final valid promos..."

cat "$DATA_DIR/unique1.txt" "$DATA_DIR/unique2.txt" "$DATA_DIR/unique3.txt" \
  | LC_ALL=C $SORT_BIN -S 4G -T "$TMP_DIR" \
  | uniq -c \
  | awk '$1 >= 2 { print $2 }' \
  > "$DATA_DIR/valid_promos.txt"

echo ""
echo "DONE! valid_promos.txt created at $DATA_DIR/valid_promos.txt"
