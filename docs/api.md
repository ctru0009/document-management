# API Documentation

A RESTful API is used to connect the front-end and back-end via JavaScript. The API is described below.

The API is at `/api/v1.0/`.

## API Endpoints

### User

| Action               | Method | Endpoint     | Data | Response      | Authorization |
|----------------------|--------|--------------|------|---------------|---------------|
| Get a user's details | GET    | `/user/<id>` |      | [User object] | Not required  |


### Session

| Action         | Method | Endpoint   | Data                 | Response       | Authorization |
|----------------|--------|------------|----------------------|----------------|---------------|
| Log a user in  | POST   | `/session` | [Credentials object] | [Token object] | Not required  |
| Log a user out | DELETE | `/session` |                      |                | Required      |


### Documents

| Action                  | Method | Endpoint                  | Data | Response                | Authorization |
|-------------------------|--------|---------------------------|------|-------------------------|---------------|
| Get a list of documents | GET    | `/document`               |      | List[[Document object]] | Not required  |
| Get a specific document | GET    | `/document/<id>`          |      | [Document object]       | Not required  |
| Download a document     | GET    | `/document/<id>/download` |      | File stream             | Not required  |
| Upload a document       | POST   | `/document`               | *    | [Document object]       | Required      |

* Multipart form with one file with name `file`.


### Authors

| Action                | Method | Endpoint       | Data            | Response              |
|-----------------------|--------|----------------|-----------------|-----------------------|
| Get a list of authors | GET    | `/person`      |                 | List[[Person object]] |
| Get a specific author | GET    | `/person/<id>` |                 | [Person object]       |
| Create an author      | POST   | `/person`      | [Person object] | [Person object]       |


### Assessments

| Action                    | Method | Endpoint           | Data                      | Response                      | Authorization |
|---------------------------|--------|--------------------|---------------------------|-------------------------------|---------------|
| Get a list of assessments | GET    | `/assessment`      |                           | List[[AssessmentRead object]] | Not required  |
| Get a specific assessment | GET    | `/assessment/<id>` |                           | [AssessmentRead object]       | Not required  |
| Create an assessment      | POST   | `/assessment`      | [AssessmentCreate object] | [AssessmentRead object]       | Required      |


### Submissions

| Action                                      | Method | Endpoint                      | Data                      | Response                      |
|---------------------------------------------|--------|-------------------------------|---------------------------|-------------------------------|
| Get a list of all submissions               | GET    | `/submission`                 |                           | List[[SubmissionRead object]] |
| Get a specific submission                   | GET    | `/submission/<id>`            |                           | [SubmissionRead object]       |
| Get a list of submissions for an assessment | GET    | `/assessment/<id>/submission` |                           | List[[SubmissionRead object]] |
| Create a submission                         | POST   | `/assessment/<id>/submission` | [SubmissionCreate object] | [SubmissionRead object]       |


### Results

| Action                       | Method | Endpoint                | Data                       | Return                   | Authentication |
|------------------------------|--------|-------------------------|----------------------------|--------------------------|----------------|
| Get results for a submission | GET    | `/submission/<id>/mark` |                            | List[[MarksRead object]] | Not required   |
| Add results for a submission | POST   | `/submission/<id>/mark` | List[[MarksCreate object]] | List[[MarksRead object]] | Required       |


## API Objects

### Credentials object

[Credentials object]: #credentials-object

| Field      | Type   | Optionality | Notes                           |
|------------|--------|-------------|---------------------------------|
| `email`    | String | Required    | User's registered email address |
| `password` | String | Required    | User's password                 |

### Token object

[Token object]: #token-object

| Field          | Type   | Optionality | Explanation                                            |
|----------------|--------|-------------|--------------------------------------------------------|
| `access_token` | String | Required    | JSON web token that can be used to authorize the user. |

When sending requests to protected API endpoints, send the `access_token` part of this object in the `Authorization` header.

| Header          | Value                          |
|-----------------|--------------------------------|
| `Authorization` | `Bearer <authorization_token>` |


### User object

[User object]: #user-object

| Field   | Type   | Explanation  |
|---------|--------|--------------|
| `id`    | Int    | User ID      |
| `name`  | String | User's name  |
| `email` | string | User's email |


### Document object

[Document object]: #document-object

| Field         | Type   | Explanation                                               |
|---------------|--------|-----------------------------------------------------------|
| `id`          | Int    | Document's ID                                             |
| `name`        | String | Document's filename                                       |
| `type`        | String | Document's mime type                                      |
| `ctime`       | String | Creation time of the document                             |
| `size`        | Int    | Filesize in bytes                                         |
| `owner.id`    | Int    | File owner's ID                                           |
| `owner.name`  | String | File owner's name                                         |
| `downloadURL` | String | URL from which the contents of the file may be downloaded |


### Person object

[Person object]: #person-object

| Field | Type   | Explanation        |
|-------|--------|--------------------|
| id    | Int    | Person object's ID |
| name  | String | Person's name      |


### AssessmentCreate object

[AssessmentCreate object]: #assessmentcreate-object

| Field    | Type                           | Explanation                                                    |
|----------|--------------------------------|----------------------------------------------------------------|
| name     | String                         | Assessment's name                                              |
| rubric   | Integer                        | ID of the [Document object] to use as this assessment's rubric |
| criteria | List[[CriterionCreate object]] | List of criteria for this assessment                           |


### AssessmentRead object

[AssessmentRead object]: #assessmentread-object

| Field       | Type                          | Explanation                                    |
|-------------|-------------------------------|------------------------------------------------|
| id          | Integer                       | Assessment's ID                                |
| name        | String                        | Assessment's name                              |
| ctime       | String                        | Creation time of the assessment                |
| rubric.id   | Integer                       | ID of the assessment's rubric                  |
| rubric.name | String                        | Filename of the assessment's rubric            |
| owner.id    | Integer                       | ID of the assessment owner in the database     |
| owner.name  | String                        | Assessment owner's name                        |
| minMarks    | Integer                       | Minimum marks earnable on this assessment      |
| maxMarks    | Integer                       | Maximum marks earnable on this assessment      |
| criteria    | List[[CriterionRead object]]  | List of criteria that apply to this assessment |
| submissions | List[[SubmissionRead object]] | Submissions (excluding assessment object)      |


### CriterionCreate object

[CriterionCreate object]: #criterioncreate-object

| Field | Type    | Value                                               |
|-------|---------|-----------------------------------------------------|
| name  | String  | Criterion's name                                    |
| min   | Integer | Minimum number of marks awardable for the criterion |
| max   | Integer | Maximum number of marks awardable for the criterion |


### CriterionRead object

[CriterionRead object]: #criterionread-object

| Field | Type    | Value                                               |
|-------|---------|-----------------------------------------------------|
| id    | Integer | Criterion's ID                                      |
| name  | String  | Criterion's name                                    |
| min   | Integer | Minimum number of marks awardable for the criterion |
| max   | Integer | Maximum number of marks awardable for the criterion |


### ResultCreate object

[ResultCreate object]: #resultcreate-object

| Field     | Type         | Explanation                                        |
|-----------|--------------|----------------------------------------------------|
| value     | Integer      | Number of marks allocated for this criterion       |
| criterion | Integer      | ID for the criterion to which this result pertains |
| comment   | String\|null | Comment for this result                            |


### ResultRead object

[ResultRead object]: #resultread-object

| Field       | Type                   | Explanation                                          |
|-------------|------------------------|------------------------------------------------------|
| value       | Integer                | Number of marks allocated for this criterion         |
| criterion   | [CriterionRead object] | Criterion to which this result pertains              |
| marker.id   | Integer                | ID of the user who gave the mark for this criterion  |
| marker.name | String                 | Name of the marker who gave the mark for this result |
| marked      | String                 | Date and time at which this mark was given           |
| comment     | String\|null           | Comment for this result                              |


### SubmissionCreate object

[SubmissionCreate object]: #submissioncreate-object

| Field       | Type          | Explanation                                              |
|-------------|---------------|----------------------------------------------------------|
| attachments | List[Integer] | List of IDs of the Documents attached to this submission |
| authors     | List[Integer] | List of IDs of authors of this submission                |


### SubmissionRead object

[SubmissionRead object]: #submissionread-object

| Field       | Type                      | Explanation                                                                                  |
|-------------|---------------------------|----------------------------------------------------------------------------------------------|
| id          | Integer                   | ID of the submission                                                                         |
| ctime       | String                    | Creation time of the submission                                                              |
| assessment  | [AssessmentRead object]   | Assessment to which this submission pertains (only includes id, name, minMarks and maxMarks) |
| totalMarks  | Integer                   | Total marks awarded for this submission                                                      |
| attachments | List[[Document object]]   | Documents attached to this submission                                                        |
| authors     | List[[Person object]]     | List of authors of this assessment                                                           |
| results     | List[[ResultRead object]] | Break down of marks awarded for this submission (only includes the criterion and value)      |


### MarksCreate object

[MarksCreate object]: #markscreate-object

| Field    | Type                        | Explanation                                |
|----------|-----------------------------|--------------------------------------------|
| results  | List[[ResultCreate object]] | The individual results for this submission |
| feedback | String\|null                | Feedback comment on this submission.       |


### MarksRead object

[MarksRead object]: #marksread-object

| Field               | Type                      | Explanation                                |
|---------------------|---------------------------|--------------------------------------------|
| assessment.id       | Integer                   | Assessment's ID                            |
| assessment.name     | String                    | Name of the assessment                     |
| assessment.minMarks | Integer                   | Minimum marks earnable on this assessment  |
| assessment.maxMarks | Integer                   | Maximum marks earnable on this assessment  |
| results             | List[[ResultRead object]] | The individual results for this submission |
| feedback            | String\|null              | Feedback comment on this submission.       |
