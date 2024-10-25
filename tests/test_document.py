import pytest
from http import HTTPStatus

DOCUMENTS = [{"id": 1,
              "name": "Rubric1.pdf",
              "type": "application/pdf",
              "ctime": "2024-04-05T09:30:00",
              "size": 10240,
              "owner": {"id": 1,
                        "name": "Test User"},
              "downloadURL": "/api/v1.0/document/1/download"},
             {"id": 2,
              "name": "Rubric2.pdf",
              "type": "application/pdf",
              "ctime": "2024-05-01T09:30:00",
              "size": 11568,
              "owner": {"id": 2,
                        "name": "Alice Wang"},
              "downloadURL": "/api/v1.0/document/2/download"},
             {"id": 3,
              "name": "submission1.pdf",
              "type": "application/pdf",
              "ctime": "2024-05-10T17:45:36",
              "size": 76864,
              "owner": {"id": 3,
                        "name": "Bob Smith"},
              "downloadURL": "/api/v1.0/document/3/download"}]


def test_get_documents(client):
    response = client.get("/api/v1.0/document")
    assert response.status_code == HTTPStatus.OK
    assert response.json == DOCUMENTS


@pytest.mark.parametrize("document", DOCUMENTS)
def test_get_document(client, document):
    response = client.get(f"/api/v1.0/document/{document["id"]}")
    assert response.status_code == HTTPStatus.OK
    assert response.json == document


@pytest.mark.xfail
def test_download_document(client):
    raise NotImplementedError


@pytest.mark.xfail
def test_upload_document(client):
    raise NotImplementedError
