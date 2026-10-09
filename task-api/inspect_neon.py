
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

database_url = os.getenv("DATABASE_URL")

if not database_url:
    raise RuntimeError("DATABASE_URL was not found in .env")

engine = create_engine(database_url, pool_pre_ping=True)

try:
    with engine.connect() as connection:
        print("Connected successfully!")

        database = connection.execute(
            text("SELECT current_database()")
        ).scalar_one()

        schema = connection.execute(
            text("SELECT current_schema()")
        ).scalar_one()

        print("Database:", database)
        print("Schema:", schema)

        tables = connection.execute(
            text("""
                SELECT table_schema, table_name
                FROM information_schema.tables
                WHERE table_type = 'BASE TABLE'
                  AND table_schema NOT IN (
                      'pg_catalog', 'information_schema'
                  )
                ORDER BY table_schema, table_name
            """)
        ).all()

        print("\nTables found:")
        if tables:
            for table_schema, table_name in tables:
                print(f"  {table_schema}.{table_name}")
        else:
            print("  No tables found.")

        version_table = connection.execute(
            text("""
                SELECT EXISTS (
                    SELECT 1
                    FROM information_schema.tables
                    WHERE table_schema = current_schema()
                      AND table_name = 'alembic_version'
                )
            """)
        ).scalar_one()

        print("\nAlembic version table exists:", version_table)

        if version_table:
            versions = connection.execute(
                text("SELECT version_num FROM alembic_version")
            ).scalars().all()
            print("Applied migration revision(s):", versions)

finally:
    engine.dispose()


for table in ("users", "tasks"):
    count = connection.execute(
        text(f'SELECT COUNT(*) FROM public."{table}"')
    ).scalar_one()

    print(f"{table}: {count} records")