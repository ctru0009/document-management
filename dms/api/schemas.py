from marshmallow import Schema, fields
from flask_marshmallow.fields import URLFor
from dms import ma


class AuthorSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String()


class UserSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String()
    email = fields.Email()
    password = fields.String(load_only=True)


class CredentialsSchema(UserSchema):
    class Meta:
        only = ("email", "password")


class DocumentSchema(ma.Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String()
    type = fields.String(attribute="mime")
    size = fields.Integer(attribute="filesize")
    ctime = fields.DateTime(attribute="uploaded")
    owner = fields.Nested(UserSchema(only=("id", "name")))
    download_url = URLFor(
        "api.documentdownloadresource", {"id": "<id>"}, data_key="downloadURL")


class CriterionSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    min = fields.Integer(required=True)
    max = fields.Integer(required=True)


class ResultSchema(Schema):
    value = fields.Integer(required=True)
    marker = fields.Nested(UserSchema, dump_only=True)
    marked = fields.DateTime(dump_only=True)
    criterion = fields.Nested(CriterionSchema(), dump_only=True)
    criterion_id = fields.Integer(load_only=True, data_key="criterion")
    comment = fields.String(load_default=None)


class AssessmentSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    ctime = fields.DateTime(attribute="created", dump_only=True)
    rubric = fields.Nested(DocumentSchema, dump_only=True)
    rubric_id = fields.Integer(data_key="rubric", load_only=True)
    criteria = fields.List(fields.Nested(CriterionSchema), required=True)
    owner = fields.Nested(UserSchema, dump_only=True)
    minMarks = fields.Int(dump_only=True)
    maxMarks = fields.Int(dump_only=True)
    submissions = fields.Nested(
        lambda: SubmissionSchema(many=True, exclude=("assessment",)),
        dump_only=True)


class MarksSchema(Schema):
    assessment = fields.Nested(
        AssessmentSchema, dump_only=True,
        only=["name", "id", "minMarks", "maxMarks"])
    results = fields.Nested(ResultSchema, many=True, required=True)
    feedback = fields.String()


class SubmissionSchema(Schema):
    id = fields.Integer(dump_only=True)
    ctime = fields.DateTime(dump_only=True, attribute="submitted")
    # assessment_id = fields.Integer(load_only=True, data_key="assessment")
    assessment = fields.Nested(AssessmentSchema(
        only=["id", "name", "minMarks", "maxMarks"]), dump_only=True)
    totalMarks = fields.Integer(dump_only=True)
    attachments = fields.Nested(DocumentSchema(many=True), dump_only=True)
    attachment_ids = fields.List(
        fields.Integer(), load_only=True, data_key="attachments")
    authors = fields.Nested(AuthorSchema(many=True), dump_only=True)
    author_ids = fields.List(
        fields.Integer(), load_only=True, data_key="authors")
    results = fields.Nested(
        ResultSchema(many=True, only=["criterion", "value"]), dump_only=True)
    feedback = fields.String()

class LoggerSchema(Schema):
    id = fields.Integer(dump_only=True)
    user = fields.Nested(UserSchema, dump_only=True)
    action = fields.String()
    timestamp = fields.DateTime()
    description = fields.String()
    status = fields.String()