from __future__ import annotations

import argparse
import sys
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.fixtures import DEFAULT_FIXTURE_PATH, seed_admin_api_mock_fixture

# Ensure model metadata is registered before create_all.
import app.models as _models  # noqa: F401


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Seed the backend database with the admin dashboard mock data fixture."
    )
    parser.add_argument(
        "--fixture",
        type=Path,
        default=DEFAULT_FIXTURE_PATH,
        help="Optional path to a fixture JSON file shaped like admin-frontend/assets/js/api.js MOCK data.",
    )
    args = parser.parse_args()

    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        summary = seed_admin_api_mock_fixture(db, fixture_path=args.fixture)

    print(f"Seeded fixture from {args.fixture}")
    for key, value in summary.items():
        print(f"- {key}: {value}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
