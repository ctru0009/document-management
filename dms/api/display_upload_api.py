from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
import dms.models as models
from dms import db, jwt
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, set_access_cookies, \
    unset_jwt_cookies, jwt_required
from flask_cors import CORS
import os

bp = Blueprint('upload_display_api', __name__, url_prefix='/api/v1.0')
CORS(bp, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

upload_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../static/uploads')
static_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../static')

@jwt_required()
@bp.route('/static/<path:path>')
def send_static(path):
    return send_from_directory(static_folder, path)


# @jwt_required()
# @bp.route('/upload', methods=['POST'])
# def upload():
#     try:
#         file = request.files['file']
#         # Create a folder named uploads in the static folder
#         os.makedirs(upload_folder, exist_ok=True)
#         file.save(os.path.join(upload_folder, file.filename))
#         return 'File uploaded successfully', 200
#     except Exception as e:
#         return str(e), 400
    
@jwt_required()
@bp.route('/upload/criteria', methods=['POST'])
def upload_criteria():
    try:
        file = request.files['file']
        # Create a folder named uploads in the static folder
        os.makedirs(upload_folder, exist_ok=True)
        file.save(os.path.join(upload_folder, file.filename))
        return 'File uploaded successfully', 200
    except Exception as e:
        return str(e), 400
    
