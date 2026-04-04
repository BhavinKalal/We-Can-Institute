from __future__ import annotations


def test_health_endpoint_returns_ok(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert "timestamp" in payload


def test_public_homepage_endpoint_shape(client):
    response = client.get("/api/v1/public/homepage")
    assert response.status_code == 200
    payload = response.json()
    assert "generated_at" in payload
    assert "hero" in payload
    assert "settings" in payload
    assert isinstance(payload.get("batches"), list)
    assert isinstance(payload.get("faculty"), list)
    assert isinstance(payload.get("gallery"), list)
    assert isinstance(payload.get("blog_posts"), list)
    assert isinstance(payload.get("testimonials"), list)


def test_public_enquiry_create_accepts_valid_payload(client):
    response = client.post(
        "/api/v1/public/enquiries",
        json={
            "name": "  Bhavin   Kalal ",
            "phone": "9876543210",
            "batch_name": "  Basic  ",
            "notes": "  Please call after 6 pm.  ",
        },
    )
    assert response.status_code == 201
    payload = response.json()
    assert payload["name"] == "Bhavin Kalal"
    assert payload["phone"] == "9876543210"
    assert payload["batch_name"] == "Basic"
    assert payload["notes"] == "Please call after 6 pm."
    assert payload["status"] == "new"
    assert payload["source"] == "website"


def test_public_enquiry_create_rejects_invalid_phone(client):
    response = client.post(
        "/api/v1/public/enquiries",
        json={
            "name": "Test User",
            "phone": "abc123",
            "batch_name": "Basic",
        },
    )
    assert response.status_code == 422
    payload = response.json()
    assert "detail" in payload
