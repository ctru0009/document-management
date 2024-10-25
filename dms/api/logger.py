from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource
from sqlalchemy import select
from dms.models import Logger
from dms import db
from .schemas import LoggerSchema


class LoggerResource(Resource):
    def _get_logs(self, user_id=None):
        query = select(Logger)
        if user_id is not None:
            query = query.where(Logger.user_id == user_id)
        logs = db.session.scalars(query)
        return LoggerSchema(many=True).dump(logs)

    def _get_log(self, id):
        log = db.get_or_404(Logger, id)
        return LoggerSchema().dump(log)

    @jwt_required()
    def get(self):
        user_id = current_user.id
        if current_user.email == "admin@gmail.com":
            return self._get_logs()
        return  self._get_logs(user_id)
