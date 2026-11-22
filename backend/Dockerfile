FROM python:3.12-slim-bookworm AS builder

WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

COPY pyproject.toml .
RUN pip install --no-cache-dir --upgrade pip && \
    python -c 'import tomllib, subprocess, sys; subprocess.check_call([sys.executable, "-m", "pip", "wheel", "--no-cache-dir", "--wheel-dir", "/app/wheels", *tomllib.load(open("pyproject.toml", "rb"))["project"]["dependencies"]])'

FROM python:3.12-slim-bookworm

WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 curl && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd -r swiftpy && useradd -r -g swiftpy swiftpy

COPY --from=builder /app/wheels /wheels
RUN pip install --no-cache-dir /wheels/*

COPY . .
RUN chown -R swiftpy:swiftpy /app

USER swiftpy
EXPOSE 8000

CMD ["swiftpy", "start", "--host", "0.0.0.0", "--port", "8000", "--reload"]
