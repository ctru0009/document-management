import pytest
from dms.models import User, Criterion


def test_user():
    user = User(
        name="Test User",
        email="test@example.com",
        password="password")
    assert user.password != "password"
    assert user.check_password_hash("password")


def test_criterion_range():
    with pytest.raises(ValueError):
        Criterion(name="Rangeless criterion", min=1, max=1)
    with pytest.raises(ValueError):
        Criterion(name="Wrong way criterion", min=10, max=0)
