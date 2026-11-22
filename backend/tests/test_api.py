from __future__ import annotations

import pytest
from swiftpy.testing.http_client import TestClient


@pytest.mark.asyncio
async def test_health_check_endpoint(client: TestClient) -> None:
    response = await client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
