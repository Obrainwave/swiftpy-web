from __future__ import annotations

from typing import ClassVar

from swiftpy.core.providers.base import ServiceProvider
from swiftpy.events import EventDispatcher, RedisEventBus

from app.events.user_registered import UserRegistered
from app.listeners.send_welcome_notification import SendWelcomeNotification


class EventServiceProvider(ServiceProvider):
    """
    Wires domain events to their asynchronous listener classes.
    """

    LISTENERS: ClassVar[dict[type, list[type]]] = {
        UserRegistered: [SendWelcomeNotification],
    }

    def register(self) -> None:
        self.container.singleton(
            EventDispatcher, lambda _: EventDispatcher()
        )
        self.container.singleton(
            RedisEventBus,
            lambda c: RedisEventBus(
                dispatcher=c.resolve(EventDispatcher),
            ),
        )

    def boot(self) -> None:
        dispatcher = self.container.resolve(EventDispatcher)
        for event_cls, listener_classes in self.LISTENERS.items():
            for listener_cls in listener_classes:
                listener_inst = listener_cls()
                dispatcher.listen(event_cls, listener_inst.handle)
