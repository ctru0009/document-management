from . import db
from datetime import datetime
from sqlalchemy import Column, ForeignKey
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import Mapped, Relationship, mapped_column, validates
from typing import List, Optional
from werkzeug.security import check_password_hash, generate_password_hash

submission_author = db.Table(
    "submission_author",
    Column("submission_id", ForeignKey(
        "submission.submission_id"), primary_key=True),
    Column("author_id", ForeignKey("author.author_id"), primary_key=True)
)

submission_attachment = db.Table(
    "submission_attachment",
    Column("submission_id", ForeignKey(
        "submission.submission_id"), primary_key=True),
    Column("attachment_id", ForeignKey(
        "document.document_id"), primary_key=True)
)


class User(db.Model):
    """An application user."""
    __tablename__ = "user"

    id: Mapped[int] = mapped_column("user_id", primary_key=True)
    name: Mapped[str] = mapped_column("user_name")
    email: Mapped[str] = mapped_column("user_email", unique=True)
    _password: Mapped[str] = mapped_column("user_password")

    documents: Mapped[List["Document"]] = Relationship(back_populates="owner")
    assessments: Mapped["Assessment"] = Relationship(back_populates="owner")
    loggers: Mapped[List["Logger"]] = Relationship(back_populates="user")

    @hybrid_property
    def password(self) -> str:
        return self._password

    @password.setter  # type: ignore[no-redef]
    def password(self, password):
        self._password = generate_password_hash(password)

    def __repr__(self):
        return f'<User {self.name} ({self.email})>'

    def check_password_hash(self, password: str) -> bool:
        return check_password_hash(self.password, password)


class Document(db.Model):
    """A document (not necessarily a text document) which may be an assessment
    submission or the assessment itself."""
    __tablename__ = "document"

    id: Mapped[int] = mapped_column("document_id", primary_key=True)
    name: Mapped[str] = mapped_column("document_name")
    mime: Mapped[str] = mapped_column("document_mime")
    uploaded: Mapped[datetime] = mapped_column("document_uploaded")
    filename: Mapped[str] = mapped_column(
        "document_filesystem_name", unique=True)
    filesize: Mapped[int] = mapped_column("document_filesystem_size")
    owner_id: Mapped[int] = mapped_column(ForeignKey("user.user_id"))

    owner: Mapped[User] = Relationship(back_populates="documents")

    def __repr__(self):
        return f'<Document {self.name} ({self.mime})>'


class Author(db.Model):
    """A submission author."""
    __tablename__ = "author"

    id: Mapped[int] = mapped_column("author_id", primary_key=True)
    name: Mapped[str] = mapped_column("author_name")

    submissions: Mapped[List["Submission"]] = Relationship(
        secondary=submission_author, back_populates="authors")


class Criterion(db.Model):
    __tablename__ = "criterion"

    id: Mapped["int"] = mapped_column("criterion_id", primary_key=True)
    name: Mapped[str] = mapped_column("criterion_name")
    min: Mapped[int] = mapped_column("criterion_min")
    max: Mapped[int] = mapped_column("criterion_max")
    assessment_id: Mapped[int] = mapped_column(
        ForeignKey("assessment.assessment_id"))

    assessment: Mapped["Assessment"] = Relationship(back_populates="criteria")

    @validates("min", "max")
    def validate_range(self, key, value):
        if key == "min" and isinstance(self.max, int):
            if value >= self.max:
                raise ValueError(
                    "A criterion's min must be less than its max. "
                    f"Got min={value}, max={self.max}")
        if key == "max" and isinstance(self.min, int):
            if value <= self.min:
                raise ValueError(
                    "A criterion's max must be greater than its min. "
                    f"Got min={self.min}, max={value}")
        return value


class Assessment(db.Model):
    """An assessment task.
    NB. This is the task itself, not a submission, which is the deliverable for
    an assessment.
    """
    __tablename__ = "assessment"

    id: Mapped[int] = mapped_column("assessment_id", primary_key=True)
    name: Mapped[str] = mapped_column("assessment_name")
    created: Mapped[datetime] = mapped_column("assessment_created")
    modified: Mapped[Optional[datetime]] = mapped_column("assessment_modified")
    owner_id: Mapped[int] = mapped_column(ForeignKey("user.user_id"))
    rubric_id: Mapped[int] = mapped_column(ForeignKey("document.document_id"))

    owner: Mapped["User"] = Relationship(back_populates="assessments")
    rubric: Mapped["Document"] = Relationship()
    criteria: Mapped[List["Criterion"]] = Relationship(
        back_populates="assessment")
    submissions: Mapped[List["Submission"]] = Relationship(
        back_populates="assessment")

    @hybrid_property
    def maxMarks(self) -> int:
        return sum([criterion.max for criterion in self.criteria])

    @hybrid_property
    def minMarks(self) -> int:
        return sum([criterion.min for criterion in self.criteria])


class Result(db.Model):
    __tablename__ = "result"

    submission_id: Mapped[int] = mapped_column(
        ForeignKey("submission.submission_id"), primary_key=True)
    criterion_id: Mapped[int] = mapped_column(
        ForeignKey("criterion.criterion_id"), primary_key=True)
    value: Mapped[int] = mapped_column("result_value")
    comment: Mapped[Optional[str]] = mapped_column("result_comment")
    marker_id: Mapped[int] = mapped_column(ForeignKey("user.user_id"))
    marked: Mapped[datetime] = mapped_column("result_marked")

    submission: Mapped["Submission"] = Relationship(back_populates="results")
    criterion: Mapped["Criterion"] = Relationship()
    marker: Mapped["User"] = Relationship()


class Submission(db.Model):
    """A submission. That is, the deliverable for an assessment."""
    __tablename__ = "submission"

    id: Mapped[int] = mapped_column("submission_id", primary_key=True)
    submitted: Mapped[datetime] = mapped_column("submission_submitted")
    modified: Mapped[Optional[datetime]] = mapped_column("submission_modified")
    feedback: Mapped[Optional[str]] = mapped_column("submission_feedback")
    assessment_id: Mapped[int] = mapped_column(
        ForeignKey("assessment.assessment_id"))

    assessment: Mapped["Assessment"] = Relationship(
        back_populates="submissions")
    authors: Mapped[List["Author"]] = Relationship(
        secondary=submission_author, back_populates="submissions")
    attachments: Mapped[List["Document"]] = Relationship(
        secondary=submission_attachment)
    results: Mapped[list[Result]] = Relationship(back_populates="submission")

    @hybrid_property
    def totalMarks(self) -> int:
        return sum([result.value for result in self.results])


class Logger(db.Model):
    __tablename__ = "user_actions"

    id: Mapped[int] = mapped_column(
        "log_id", primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.user_id"))
    timestamp: Mapped[datetime] = mapped_column(
        "log_timestamp", nullable=False)
    action: Mapped[str] = mapped_column("log_action", nullable=False)
    description: Mapped[str] = mapped_column("log_description")
    status: Mapped[str] = mapped_column("log_status", default="success")

    user: Mapped[User] = Relationship(back_populates="loggers")

    def __repr__(self):
        return f'<Logged action {self.action} by {self.user_id} at {self.timestamp} with status {self.status}: {self.description}>'
