#!/usr/bin/env bash

# args
if [ $# -ne 2 ]; then
  echo "Usage: $0 <target_file> <new_rpath>"
  exit 1
fi

target="$1"
new_rpath="$2"

# check file existence
if [ ! -f "$target" ]; then
  echo "Error: target file '$target' does not exist."
  exit 1
fi

# remove all LC_RPATH
"otool" -l "$target" | awk '
  /LC_RPATH/ { found=1; next }
  found && /path/ {
    sub(/^ +path /, "", $0);
    sub(/ .*/, "", $0);
    print $0;
    found=0;
  }
' | while read -r rpath; do
  echo "Deleting rpath: $rpath"
  "install_name_tool" -delete_rpath "$rpath" "$target"
done

# add new rpath
echo "Adding rpath: $new_rpath"
"install_name_tool" -add_rpath "$new_rpath" "$target"

echo "Done."
