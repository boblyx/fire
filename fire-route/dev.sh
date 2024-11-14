set -o allexport
source sample.env
source venv/bin/activate
python api.py
set +o allexport
