import os
import os.path
import atexit

from dotenv import load_dotenv
from flask import Flask, render_template, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from diskcache import Cache  # type: ignore
from flask_migrate import Migrate
from flask_cors import CORS

db: SQLAlchemy = SQLAlchemy()
ma: Marshmallow = Marshmallow()
migrate: Migrate = Migrate()
jwt: JWTManager = JWTManager()
jwt_blocklist: Cache = None
cors: CORS = CORS(
    resources={r"*": {"origins": "*"}}, supports_credentials=True)


def create_app(test_config=None):
    global db, ma, migrate, jwt, jwt_blocklist
    load_dotenv()
    app = Flask(__name__, instance_relative_config=True,  static_folder='static/assets', template_folder='static')
    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL'),
        FILE_UPLOAD_PATH=os.path.join(app.instance_path, "uploads"),
        JWT_BLOCKLIST_PATH=os.path.join(app.instance_path, "blocklist"),
        JWT_TOKEN_LOCATION=["headers", "cookies"],
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    # Create the app directories if they don't already exist
    os.makedirs(app.instance_path, exist_ok=True)
    os.makedirs(app.config["FILE_UPLOAD_PATH"], exist_ok=True)
    os.makedirs(app.config["JWT_BLOCKLIST_PATH"], exist_ok=True)

    # Initialise the blocklist cache
    jwt_blocklist = Cache(app.config["JWT_BLOCKLIST_PATH"])

    # Initialize the database
    db.init_app(app)
    ma.init_app(app)

    # Set up the JWT manager
    jwt.init_app(app)

    # Set up the migration manager
    migrate.init_app(app, db)

    # Set up cross-origin resource sharing
    cors.init_app(app)


    # Register the index route
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        return render_template("index.html")

    from . import api
    app.register_blueprint(api.bp)
    return app


@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
    jti = jwt_payload["jti"]
    token_in_blocklist = jwt_blocklist.get(jti)
    return token_in_blocklist is not None


@jwt.user_identity_loader
def user_to_id(user):
    return user.id


@jwt.user_lookup_loader
def jwt_to_user(jwt_header, jwt_data):
    from .models import User
    id = jwt_data["sub"]
    return User.query.filter_by(id=id).one_or_none()


@atexit.register
def close_jwt_blocklist():
    if isinstance(jwt_blocklist, Cache):
        jwt_blocklist.close()
