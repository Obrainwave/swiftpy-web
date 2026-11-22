from __future__ import annotations

import os
from collections.abc import AsyncGenerator, Generator

import pytest

# Ensure testing environment
os.environ["APP_ENV"] = "testing"
os.environ["MAIL_MAILER"] = "fake"

from swiftpy.mail import Mail
from swiftpy.testing.http_client import TestClient

from main import app


@pytest.fixture
async def client() -> AsyncGenerator[TestClient, None]:
    """Test client fixture for making requests against the application."""
    async with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(autouse=True)
def fake_mail() -> Generator[object, None, None]:
    """Automatically fake mail subsystem during test runs."""
    with Mail.fake() as fake:
        yield fake
