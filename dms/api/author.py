from datetime import datetime
from typing import Sequence
from flask import abort, request
from flask_jwt_extended import current_user, jwt_required
from flask_restful import Resource  # type: ignore
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from http import HTTPStatus
from .schemas import AuthorSchema

from dms import db
from dms.models import Author, Logger


class AuthorResource(Resource):
    def _get_authors(self) -> Sequence[Author]:
        query = select(Author)
        authors = db.session.scalars(query).all()
        return AuthorSchema(many=True).dump(authors)

    def _get_author(self, id) -> Author:
        author = db.get_or_404(Author, id)
        return AuthorSchema().dump(author)

    def get(self, id=None):
        if id is None:
            return self._get_authors()
        return self._get_author(id)
    
    @jwt_required()
    def post(self) -> Author:
        args = AuthorSchema().load(request.json)
        name = args["name"]
        author = Author(name=name)
        log = Logger(
            user=current_user,
            action="create",
            timestamp=datetime.now(),
            description=f"Author {name} created by {current_user.name}"
        )
        try:
            db.session.add(log)
            db.session.add(author)
            db.session.commit()
        except IntegrityError:
            abort(HTTPStatus.BAD_REQUEST, "Unable to create user")
        return AuthorSchema().dump(author)
