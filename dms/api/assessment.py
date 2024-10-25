from datetime import datetime
from http import HTTPStatus

from flask import abort, request
from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource  # type: ignore
from marshmallow import Schema, fields, pre_load, EXCLUDE

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from dms import db
from dms.models import Assessment, Criterion, Logger
from .schemas import AssessmentSchema


class AssessmentResourceParamsSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    @pre_load
    def lower_fields(self, data, **kwargs):
        return {key.casefold(): value for key, value in data.items()}

    owner_id = fields.Integer(data_key="ownerid", load_default=None)


class AssessmentResource(Resource):
    def _get_assessment(self, id):
        return AssessmentSchema().dump(db.get_or_404(Assessment, id))

    def _get_assessments(self):
        args = AssessmentResourceParamsSchema().load(request.args)
        query = select(Assessment)
        if (owner_id := args["owner_id"]) is not None:
            query = query.where(Assessment.owner_id == owner_id)
        assessments = db.session.scalars(query)
        return AssessmentSchema(many=True).dump(assessments)

    def _get_assessments(self, owner_id=None):
        query = select(Assessment)
        if owner_id is not None:
            query = query.where(Assessment.owner_id == owner_id)
        assessments = db.session.scalars(query)
        return AssessmentSchema(many=True).dump(assessments)

    @jwt_required()
    def get(self, id=None):
        owner_id = current_user.id
        if id is not None:
            return self._get_assessment(id)
        if owner_id is not None:
            return self._get_assessments(owner_id)
        return self._get_assessments()

    @jwt_required()
    def post(self) -> Assessment:
        assessmentParser = AssessmentSchema()
        args = assessmentParser.load(request.get_json())
        name = args["name"]
        rubric_id = args["rubric_id"]
        criteria = []
        for criterion in args["criteria"]:
            try:
                criteria.append(Criterion(**criterion))
            except ValueError as e:
                abort(HTTPStatus.UNPROCESSABLE_ENTITY,
                      {criterion["name"], str(e)})
        assessment = Assessment(
            name=name, rubric_id=rubric_id, created=datetime.now(),
            criteria=list(criteria), owner_id=current_user.id)
        log = Logger(
            user=current_user,
            action="create",
            timestamp=datetime.now(),
            description=f"Assessment {name} created by {current_user.name}"
        )
        dbsession = db.session
        try:
            dbsession.add(log)
            dbsession.add(assessment)
            dbsession.commit()
        except IntegrityError:
            dbsession.rollback()
            abort(HTTPStatus.BAD_REQUEST, {"msg": "Unable to add assessment"})
        return AssessmentSchema().dump(assessment), HTTPStatus.CREATED
