#!/bin/bash
cd "$(dirname "$0")"
bash preview.sh
python3 serve.py 8080 /tmp/festa-deploy
