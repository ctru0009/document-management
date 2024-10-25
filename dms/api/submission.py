from datetime import datetime
from http import HTTPStatus

from flask import abort, request
from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource  # type: ignore
from sqlalchemy import select

from dms import db
from dms.models import Assessment, Author, Document, Logger, Submission

from flask_cors import CORS
from .schemas import SubmissionSchema

CORS(resources={r"/*": {"origins": "*"}}, supports_credentials=True)


submission_schema = SubmissionSchema()
submissions_schema = SubmissionSchema(
    many=True, exclude=["results", "attachments"])


class SubmissionResource(Resource):
    def _get_submission(self, id):
        return submission_schema.dump(db.get_or_404(Submission, id))

    def _get_submissions(self):
        query = select(Submission)
        submissions = db.session.scalars(query)
        return submissions_schema.dump(submissions)

    def get(self, id=None):
        if id is None:
            return self._get_submissions()
        return self._get_submission(id)


class AssessmentSubmissionResource(Resource):
    def get(self, id):
        assessment = db.get_or_404(Assessment, id)
        return submissions_schema.dump(assessment.submissions)

    @jwt_required()
    def post(self, id):
        assessment = db.session.get(Assessment, id)
        if not assessment:
            abort(HTTPStatus.UNPROCESSABLE_ENTITY,
                  f"Assessment {id} does not exist.")
        args = submission_schema.load(request.json)
        try:
            authors = get_all(db.session, Author, args["author_ids"])
        except ValueError:
            abort(HTTPStatus.UNPROCESSABLE_ENTITY, "Not all authors exist.")
        try:
            attachments = get_all(db.session, Document, args["attachment_ids"])
        except ValueError:
            abort(HTTPStatus.UNPROCESSABLE_ENTITY,
                  "Not all attachments exist.")
        submission = Submission(
            submitted=datetime.now(),
            assessment=assessment,
            authors=authors,
            attachments=attachments
        )
        log = Logger(user=current_user,
                     action="submit",
                     timestamp=datetime.now(),
                     description=f"Submission {submission.id} created for assessment {assessment.id} by {current_user.name}",
                     )
        db.session.add(log)
        db.session.add(submission)
        db.session.commit()
        return submission_schema.dump(submission)


def get_all(session, entity, ids):
    query = select(entity).filter(entity.id.in_(ids))
    entities = session.scalars(query).all()
    if len(entities) != len(ids):
        raise ValueError("Not all IDs exist in database")
    return entities
