from __future__ import annotations

from app.schemas.settings import SettingsUpdate


def test_settings_social_urls_accept_missing_scheme():
    payload = SettingsUpdate(
        instagram="instagram.com/wecaninstitute",
        facebook="facebook.com/wecaninstitute",
        linkedin="linkedin.com/company/wecaninstitute",
        youtube="youtube.com/@wecaninstitute",
    )

    assert str(payload.instagram) == "https://instagram.com/wecaninstitute"
    assert str(payload.facebook) == "https://facebook.com/wecaninstitute"
    assert str(payload.linkedin) == "https://linkedin.com/company/wecaninstitute"
    assert str(payload.youtube) == "https://youtube.com/@wecaninstitute"

