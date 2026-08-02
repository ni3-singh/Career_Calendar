# Database schema

All mutable tables use UUID identifiers and timestamps. `users` owns one `profiles` row and many categories, goals, tasks, focus sessions, reviews, and reminders. Goals optionally belong to categories; tasks optionally belong to goals and categories. Foreign keys use safe cascading only for records wholly owned by a deleted user.

Task queries are indexed by `(user_id, status, due_at)` for the daily plan. Reminder delivery uses `(sent_at, remind_at)`. Email is unique and normalized before storage.

Alembic migrations will be introduced before the first hosted database; metadata creation is intentionally limited to local development and tests in the initial vertical slice.
