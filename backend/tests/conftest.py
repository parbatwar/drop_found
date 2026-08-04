import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from app.database import Base
from app.main import app
from app.database import get_db
from fastapi.testclient import TestClient

load_dotenv()

# Reuse the real DATABASE_URL's credentials, just swap the db name
# e.g. postgresql://myuser:mypassword@localhost/dropfound
#   -> postgresql://myuser:mypassword@localhost/dropfound_test
BASE_DB_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgres:postgres@localhost/dropfound"
)
TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    BASE_DB_URL.rsplit("/", 1)[0] + "/dropfound_test",
)

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def override_get_db(db_session):
    def _get_db():
        yield db_session

    app.dependency_overrides[get_db] = _get_db
    yield
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def client(override_get_db):
    """A TestClient wired to the test database — for tests that need
    to go through actual HTTP routes (routing + validation + service
    logic together), not just call a service function directly."""
    return TestClient(app)
