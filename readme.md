
# Document Management System

The Document Management System (DMS) is a web-based application designed to help users efficiently manage, store, and retrieve documents. This system provides a user-friendly interface for uploading, organizing, making it an essential tool for businesses and individuals who need to handle large volumes of paperwork.

# Table of content

1. [Features](#features)
1. [Tech Stack](#tech-stack)
1. [Environment Variables](#environment-variables)
1. [Run](#run)
1. [API Reference](#api-reference)
1. [Developers](#developers)

## Features

- **User Authentication**: Secure login and registration for users to protect sensitive documents.
- **Document Upload**: Easily upload documents in various formats (PDF, DOCX, etc.).

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Flask (Python)
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT) for secure user authentication
- **Text Editor**: TinyMCE for text editing 
## Environment Variables

To run this project, you will need to add the following environment variables to your .`.env` file

```
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
JWT_SECRET_KEY="YourSecretKey"
VITE_API_URL="http://127.0.0.1:5000"
VITE_BACKEND_API_URL="http://127.0.0.1:5000/api/v1.0"
VITE_TINYMCE_API_KEY="<YourAPIKey>"
```

And `.flaskenv` file
```
FLASK_APP = dms
FLASK_ENV= development
FLASK_DEBUG = True
```

## Run 
Make sure to have Python, Nodejs and PosgreSQL installed.
### Backend
Install my-project with npm

With python (3.12) installed, switch to the source directory and create a virtual environment:

```bash
py -m venv .venv
```

Then, activate the virtual environment:

```bash
.venv\scripts\activate
```

Install requirements:

```bash
py -m pip install -r requirements.txt
```

For **MacOS** users, replace the 3 above command with:
```
python3 -m venv .venv
```
```
source .venv/bin/activate
```
```
pip install -r requirements.txt
```

### Database
Install the latest Postgresql and run the following commands in the terminal:

```
psql -U postgres
```

Then input the password when installing postgresql and run these commands (semicolons are important):

```
CREATE DATABASE <database_name>;
```
```
CREATE USER <username> WITH PASSWORD <password>;
```
```
GRANT ALL PRIVILEGES ON DATABASE <database_name> TO <username>;
```
```
ALTER DATABASE <database_name> OWNER TO <username>;
```

### Flask Database Migration
Create all the tables in the postgresql database
```
flask db init
```
```
flask db migrate
```
```
flask db upgrade
```

### Frontend
With Nodejs installed, run the following commands:
```
cd frontend
```
```
npm install
```
For development purpose:
```
npm run dev
```
For production purpose:
```
npm run build
```

### Final Steps
Run the Flask app:
```
flask run
```

1. **Configure a reverse proxy**:
    Set up a reverse proxy (e.g., Nginx) to forward requests to your backend and frontend servers.

2. **Secure your application**:
    Ensure your application is secured with HTTPS and proper firewall rules.

3. **Monitor and maintain**:
    Set up monitoring and logging to keep track of your application's performance and errors.

Your application should now be deployed and accessible at your server's IP address or domain name.
## API Reference
- [Internal API documentation>.](docs/api.md)
## Developers

- [@ctru0009](https://github.com/ctru0009)
- [@Darren-cy](https://github.com/Darren-cy)
- [@SaschaCowle](https://github.com/SaschaCowley)
- [@hannnz1](https://github.com/hannnz1)
- [@Iannnn0924](https://github.com/Iannnn0924)


