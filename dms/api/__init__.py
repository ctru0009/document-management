from http import HTTPStatus
from flask import Blueprint, json, request
from flask_restful import Api  # type: ignore
from flask_cors import CORS
from werkzeug.exceptions import HTTPException, NotFound
from marshmallow.exceptions import ValidationError

from dms.api.logger import LoggerResource

from .session import SessionResource
from .user import UserResource, ProfileResource
from .document import DocumentResource, DocumentDownloadResource
from .author import AuthorResource
from .assessment import AssessmentResource
from .submission import SubmissionResource, AssessmentSubmissionResource
from .result import SubmissionResultResource


bp = Blueprint('api', __name__, url_prefix='/api/v1.0')
CORS(bp, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
api = Api(bp)

api.add_resource(UserResource, "/user", "/user/<int:id>")
api.add_resource(ProfileResource, "/profile")
api.add_resource(SessionResource, "/session")
api.add_resource(DocumentResource, "/document", "/document/<int:id>")
api.add_resource(DocumentDownloadResource, "/document/<int:id>/download")
api.add_resource(AuthorResource, "/person", "/person/<int:id>")
api.add_resource(AssessmentResource, "/assessment", "/assessment/<int:id>")
api.add_resource(SubmissionResource, "/submission", "/submission/<int:id>")
api.add_resource(AssessmentSubmissionResource,
                 "/assessment/<int:id>/submission")
api.add_resource(SubmissionResultResource, "/submission/<int:id>/mark")
api.add_resource(LoggerResource, "/log", "/log/<int:user_id>")


@bp.errorhandler(HTTPException)
def api_error(e: HTTPException):
    response = e.get_response()
    response.content_type = "application/json"
    response.data = json.dumps({"message": str(e)})
    return response


@bp.app_errorhandler(NotFound)
def api_not_found(e):
    if request.path.startswith(bp.url_prefix):
        return api_error(e)
    return e


@bp.errorhandler(ValidationError)
def invalid_data(e: ValidationError):
    return {"message": e.messages}, HTTPStatus.UNPROCESSABLE_ENTITY
