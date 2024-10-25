-- Add users
insert into "user" (user_id, user_name, user_email, user_password)
values (
        1,
        "Test User",
        "test@example.com",
        -- Test_Password_42
        "scrypt:32768:8:1$kll4pHFhNW2SjcAy$7a450ef6042d8df11222c72ac9afd85d8469e9890f992a9d6056582a68ad93ece4bcd029e0c7a2d591ee0d957488c15161a5f8e619cfbfdd57a76aa56fb7171b"
    ),
    (
        2,
        "Alice Wang",
        "alice@alicesmith.net",
        -- password123
        "scrypt:32768:8:1$ycgvLQY5rRAyl7ya$129a11a08d493f2d0db32d8bc09cff5412ea4bbb2b4a1e9a4769e90e7a95efe7f45d89f7830fd8e2dc21c16972444b01ec35337dc3c9909487665e0ec524e4a9"
    ),
    (
        3,
        "Bob Smith",
        "bobsmith57@gmail.com",
        -- qwerty
        "scrypt:32768:8:1$8Wm3hUKi2xxQxqso$945d4781fd32fdb9c32de4a2295939af600e6c6f3fc0f3cfeb9fe0e718a8eacc7a763cab566c4ec871db2fd510e4fed7f71a57a7aaab5e387ec9d650801c0936"
    );
-- -- Add some authors
insert into author (author_id, author_name)
values (1, "Anh Nguyen"),
    (2, "Emma Gonzalez"),
    (3, "Isabella Rodriguez"),
    (4, "Olivia Hansen"),
    (5, "Ursula Smith");

insert into document (
        document_id,
        document_name,
        document_mime,
        document_uploaded,
        document_filesystem_name,
        document_filesystem_size,
        owner_id
    )
values (
        1,
        "Rubric1.pdf",
        "application/pdf",
        "2024-04-05T09:30:00",
        "document1",
        10240,
        1
    ),
    (
        2,
        "Rubric2.pdf",
        "application/pdf",
        "2024-05-01T09:30:00",
        "document2",
        11568,
        2
    ),
    (
        3,
        "submission1.pdf",
        "application/pdf",
        "2024-05-10T17:45:36",
        "document3",
        76864,
        3
    );

insert into assessment (
        assessment_id,
        assessment_name,
        assessment_created,
        owner_id,
        rubric_id
    )
values (
        1,
        "Fall of the Roman Empire",
        "2024-04-05T09:30",
        1,
        1
    ),
    (
        2,
        "Group Presentation: Spanish Dialogue",
        "2024-05-01T10:00",
        2,
        2
    );

insert into criterion (
        criterion_id,
        criterion_name,
        criterion_min,
        criterion_max,
        assessment_id
    )
values (1, "Presentation", 0, 3, 1),
    (2, "Spelling and grammar", 0, 3, 1),
    (3, "Cogency of arguments", 0, 5, 1),
    (4, "Use of primary sources", 0, 5, 1),
    (5, "Bibliography", 0, 4, 1);