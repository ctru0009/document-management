from datetime import datetime
from http import HTTPStatus

from flask import abort, jsonify, request
from flask_restful import Resource  # type: ignore
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from email_validator import EmailNotValidError, validate_email
from flask_jwt_extended import create_access_token, get_jwt, jwt_required, set_access_cookies, unset_jwt_cookies

from dms.models import Logger, User
from dms import db, jwt_blocklist

from .schemas import CredentialsSchema


def abort_on_invalid_credentials():
    abort(
        HTTPStatus.UNAUTHORIZED, "The email or password is incorrect.")


class SessionResource(Resource):
    def post(self):
        args = CredentialsSchema().load(request.json)
        email = args['email']
        password = args['password']
        try:
            emailInfo = validate_email(email, check_deliverability=False)
            email = emailInfo.normalized
        except EmailNotValidError:
            abort_on_invalid_credentials()

        statement = select(User).where(User.email == email)
        dbsession = db.session
        try:
            user: User = dbsession.scalars(statement).one()
        except NoResultFound:
            abort_on_invalid_credentials()

        if not user.check_password_hash(password):
            abort_on_invalid_credentials()

        access_token = create_access_token(identity=user)
        response = jsonify(access_token=access_token)
        set_access_cookies(response, access_token)
        log = Logger(
            user=user,
            action="login",
            timestamp=datetime.now(),
            description=f"User {user.name} ({user.email}) logged in successfully",
        )
        dbsession.add(log)
        dbsession.commit()

        return response

    @jwt_required()
    def delete(self):
        jti = get_jwt()['jti']
        jwt_blocklist.set(jti, "", expire=900)
        response = jsonify({"message": "Logged out."})
        unset_jwt_cookies(response)
        return response
