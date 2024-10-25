from http import HTTPStatus

from conftest import AuthActions


def test_login_valid_credentials(auth: AuthActions):
    resp = auth.login()
    assert resp.status_code == HTTPStatus.OK
    assert "access_token" in resp.json


def test_login_invalid_credentials(auth: AuthActions):
    assert auth.login(email="invalid@domain.com", password="InvalidPassword")\
        .status_code == HTTPStatus.UNAUTHORIZED


def test_logout_logged_in(auth: AuthActions):
    resp = auth.login()
    headers = AuthActions.get_headers(resp)
    assert auth.logout(headers=headers).status_code == HTTPStatus.OK


def test_logout_not_logged_in(auth: AuthActions):
    assert auth.logout().status_code == HTTPStatus.UNAUTHORIZED
