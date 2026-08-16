import ssl

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

# SQLite 는 파일(또는 메모리)이라 SSL 이 없다. 붙이면 드라이버가 거부한다.
# 운영 경로는 PostgreSQL 이고, SQLite 는 "저장소 하나만 받아서 바로 실행"을 위한 데모다.
IS_SQLITE = settings.DATABASE_URL.startswith("sqlite")

if IS_SQLITE:
    connect_args: dict = {}
else:
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE
    connect_args = {"ssl": ssl_ctx}

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True,
    connect_args=connect_args,
)

AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
