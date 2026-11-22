from __future__ import annotations

from swiftpy.core.providers.base import ServiceProvider


class AppServiceProvider(ServiceProvider):
    """
    Core application service provider.
    Registers application singletons and utilities in the DI container.
    """

    def register(self) -> None:
        pass

    def boot(self) -> None:
        pass
