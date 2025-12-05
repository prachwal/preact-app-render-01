#!/bin/bash

# Script to consolidate files from a specified folder into a single txt file
# Ignores files that are ignored by git (using git ls-files which only lists tracked files)
# Divides output into sections with file paths as headers
# Saves to ./tmp/consolidated.txt

# Check if folder parameter is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <folder>"
    exit 1
fi

folder=$1
output_file="./tmp/consolidated.txt"

# Create tmp directory if it doesn't exist
mkdir -p "./tmp"

# Clear or create the output file
> "$output_file"

# Use git ls-files to get all tracked files in the folder (ignores gitignored files)
git ls-files "$folder" | while read -r file; do
    echo "=== $file ===" >> "$output_file"
    if [ -f "$file" ]; then
        cat "$file" >> "$output_file"
    else
        echo "Warning: $file is not a regular file or doesn't exist" >> "$output_file"
    fi
    echo "" >> "$output_file"
done

echo "Consolidation complete. Output saved to $output_file"
