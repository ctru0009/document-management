import pytest
from http import HTTPStatus
from utils import dict_lists_equal
from datetime import datetime, timedelta

ASSESSMENTS = [{"id": 1,
                "name": "Fall of the Roman Empire",
                "ctime": "2024-04-05T09:30:00",
                "rubric": {"id": 1,
                           "name": "Rubric1.pdf"},
                "owner": {"id": 1,
                          "name": "Test User"},
                "minMarks": 0,
                "maxMarks": 20,
                "criteria": [{"id": 1,
                              "name": "Presentation",
                              "min": 0,
                              "max": 3},
                             {"id": 2,
                              "name": "Spelling and grammar",
                              "min": 0,
                              "max": 3},
                             {"id": 3,
                              "name": "Cogency of arguments",
                              "min": 0,
                              "max": 5, },
                             {"id": 4,
                              "name": "Use of primary sources",
                              "min": 0,
                              "max": 5, },
                             {"id": 5,
                              "name": "Bibliography",
                              "min": 0,
                              "max": 4, }],
                "submissions": []},
               {"id": 2,
                "name": "Group Presentation: Spanish Dialogue",
                "ctime": "2024-05-01T10:00:00",
                "rubric": {"id": 2,
                           "name": "Rubric2.pdf"},
                "owner": {"id": 2,
                          "name": "Alice Wang"},
                "minMarks": 0,
                "maxMarks": 0,
                "criteria": [],
                "submissions": []}]


NEW_ASSESSMENT = {"name": "Book Report: The Colour Purple",
                  "rubric": 1,
                  "criteria": [{"name": "Cogency of arguments",
                                "min": 0,
                                "max": 25},
                               {"name": "Presentation",
                                "min": 0,
                                "max": 10},
                               {"name": "Spelling and grammar",
                                "min": 0,
                                "max": 25},
                               {"name": "Appropriate use of textual references",
                                "min": 0,
                                "max": 20},
                               {"name": "Appropriate use of external references",
                                "min": 0,
                                "max": 15},
                               {"name": "Bibliography",
                                "min": 0,
                                "max": 5}]}


def test_get_assessments(client):
    response = client.get("api/v1.0/assessment")
    assert response.status_code == HTTPStatus.OK
    assert dict_lists_equal(response.json, ASSESSMENTS)


@pytest.mark.parametrize("assessment", ASSESSMENTS)
def test_get_assessment(client, assessment):
    response = client.get(f"/api/v1.0/assessment/{assessment["id"]}")
    assert response.status_code == HTTPStatus.OK
    assert response.json == assessment


def test_create_assessment(client, auth):
    auth.login()
    # now = datetime.now()
    response = client.post("/api/v1.0/assessment", json=NEW_ASSESSMENT)
    assert response.status_code == HTTPStatus.OK
    assessment = response.json
    assert abs(datetime.fromisoformat(assessment["ctime"]) - datetime.now()) \
        < timedelta(seconds=1)
    del assessment["ctime"]
    NEW_ASSESSMENT["id"] = 3
    NEW_ASSESSMENT["submissions"] = []
    NEW_ASSESSMENT["rubric"] = {"id": 1,
                                "name": "Rubric1.pdf"}
    NEW_ASSESSMENT["owner"] = {"id": 1,
                               "name": "Test User"}
    NEW_ASSESSMENT["minMarks"] = 0
    NEW_ASSESSMENT["maxMarks"] = 100
    for i in range(len(NEW_ASSESSMENT["criteria"])):
        NEW_ASSESSMENT["criteria"][i]["id"] = i+6
    assert assessment == NEW_ASSESSMENT
