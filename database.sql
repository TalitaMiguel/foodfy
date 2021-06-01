--VERIFY IF THE DB EXISTS AND CREATE IT
DROP DATABASE IF EXISTS foodfydb;
CREATE DATABASE foodfydb;

--RUN SEEDS
DELETE FROM users;
DELETE FROM files;
DELETE FROM recipes_files;
DELETE FROM chefs;
DELETE FROM recipes;
DELETE FROM session;

--RESTART ID SEQUENCE
ALTER SEQUENCE recipes_files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;

--CREATE TABLES
CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chef_id" int NOT NULL,
  "user_id" int NOT NULL,
  "title" text NOT NULL,
  "ingredients" text[],
  "preparation" text[],
  "information" text,
  "created_at" TIMESTAMP DEFAULT(now()),
  "updated_at" TIMESTAMP DEFAULT(now())
);

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "file_id" integer,
  "created_at" timestamp DEFAULT(now()),
  "updated_at" timestamp DEFAULT (now())
);
    
CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "recipes_files"(
  "id" SERIAL PRIMARY KEY,
  "recipe_id" integer,
  "file_id" integer
);

CREATE TABLE "users"(
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
  "is_admin" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP DEFAULT(now()),
  "updated_at" TIMESTAMP DEFAULT(now())
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- TABLE RELATIONS FOREING KEYS
ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");    
ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");
ALTER TABLE "recipes_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");
ALTER TABLE "recipes_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");
ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");


--CREATE PROCEDURE
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--CREATE FUNCTION AUTO updated_at for recipes
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--CREATE FUNCTION AUTO updated_at for chefs
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--CREATE FUNCTION AUTO updated_at for users
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--DELETE CASCADE
CREATE OR REPLACE FUNCTION delete_files_when_recipes_files_row_was_deleted()
RETURNS TRIGGER AS $$
BEGIN
EXECUTE ('DELETE FROM files
WHERE id = $1')
USING OLD.file_id;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- USER CASCADE TRIGGER
CREATE TRIGGER delete_recipes_files
AFTER DELETE ON recipes_files
FOR EACH ROW
EXECUTE PROCEDURE delete_files_when_recipes_files_row_was_deleted();

-- DELETE CASCADE
ALTER TABLE "recipes"
DROP CONSTRAINT recipes_user_id_fkey,
ADD CONSTRAINT recipes_user_id_fkey
FOREIGN KEY ("user_id")
REFERENCES users("id")
ON DELETE CASCADE;

ALTER TABLE "recipes_files"
DROP CONSTRAINT recipes_files_recipe_id_fkey,
ADD CONSTRAINT recipes_files_recipe_id_fkey
FOREIGN KEY ("recipe_id")
REFERENCES recipes("id")
ON DELETE CASCADE;

ALTER TABLE "recipes_files"
DROP CONSTRAINT recipes_files_file_id_fkey,
ADD CONSTRAINT recipes_files_file_id_fkey
FOREIGN KEY ("file_id")
REFERENCES files("id")
ON DELETE CASCADE;