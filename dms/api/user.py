from datetime import datetime
from http import HTTPStatus

from flask import abort, request
from flask_restful import Resource  # type: ignore
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound, IntegrityError
from flask_jwt_extended import jwt_required, current_user

from dms.models import Logger, User
from dms import db
from .schemas import UserSchema


class UserResource(Resource):
    def get(self, id):
        session = db.session
        query = select(User).where(User.id == id)
        try:
            user = session.scalars(query).one()
        except NoResultFound:
            abort(HTTPStatus.NOT_FOUND, f"User {id} does not exist.")
        else:
            return {"id": user.id, "name": user.name, "email": user.email}

    def post(self):
        userSchema = UserSchema()
        args = userSchema.load(request.json)
        user = User(
            name=args["name"],
            email=args["email"],
            password=args["password"])
        log = Logger(user=user,
                     action="register",
                     timestamp=datetime.now(),
                     description=f"User {user.name} ({user.email}) registered successfully",
                     )
        try:
            db.session.add(log)
            db.session.add(user)
            db.session.commit()
        except IntegrityError:
            abort(HTTPStatus.CONFLICT, "Account already exists.")
        else:
            return userSchema.dump(user)


class ProfileResource(Resource):
    @jwt_required()
    def get(self):
        # print(current_user)
        return UserSchema().dump(current_user)
