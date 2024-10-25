import os
import os.path

import pytest
from flask.testing import FlaskClient
from sqlalchemy import URL

from dms import create_app, db


class AuthActions:
    _client: FlaskClient
    __default_email: str = "test@example.com"
    __default_password: str = "Test_Password_42"

    def __get_credentials(
            self,
            email: str | None = None,
            password: str | None = None
    ) -> dict[str, str]:
        return {
            "email": self.__default_email if email is None else email,
            "password":
                self.__default_password if password is None else password
        }

    def __init__(self, client: FlaskClient):
        self._client = client

    def login(self, email=None, password=None, **kwargs):
        return self._client.post(
            "/api/v1.0/session",
            json=self.__get_credentials(email=email, password=password),
            **kwargs
        )

    def logout(self, **kwargs):
        return self._client.delete("/api/v1.0/session", **kwargs)

    @classmethod
    def get_headers(cls, response):
        return {"Authorization": f"Bearer {response.json['access_token']}"}


with open(os.path.join(os.path.dirname(__file__), "data.sql"), "r") as file:
    SQL_COMMANDS = file.read()


@pytest.fixture
def app(tmp_path):
    # db_url = URL.create("sqlite", database=os.path.join(tmp_path, "temp.db"))
    db_url = URL.create("sqlite", database=":memory:")

    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": str(db_url),
        "JWT_COOKIE_SECURE": False,
        "JWT_COOKIE_CSRF_PROTECT": False,
    })

    with app.app_context():
        from dms.models import (Assessment, Author, Criterion, Document,
                                Result, Submission, User,
                                submission_attachment, submission_author)
        db.create_all()

        with db.engine.begin() as conn:
            conn.connection.executescript(SQL_COMMANDS)

    yield app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()


@pytest.fixture
def auth(client):
    return AuthActions(client)


@pytest.fixture
def app_context(app):
    with app.app_context():
        yield
