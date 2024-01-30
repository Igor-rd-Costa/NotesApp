CREATE ROLE "NotesAppUser" WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  ENCRYPTED PASSWORD 'SCRAM-SHA-256$4096:1FlPWwj1moxNnRcNRFGLGA==$JIbiZHQUe+BtyG4dCOF+Qa7/CCjl+1G7uJLSWBVa3iU=:IaSN8FsZNtJK2E3jEAmuAaZji+RI01Au4vhXwmqUCTc=';

CREATE DATABASE "NotesAppDB"
    WITH
    OWNER = 'NotesAppUser'
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

\connect NotesAppDB

CREATE TABLE if NOT EXISTS users
(
	  "Id" serial not null,
    "UserName" character varying(50) not null,
    "NormalizedUserName" character varying(50) not null,
    "Email" character varying(100) not null,
    "NormalizedEmail" character varying(100) not null,
    "EmailConfirmed" boolean,
    "PasswordHash" character varying(84) not null,
    "SecurityStamp" character varying(100),
    "ConcurrencyStamp" character varying(100),
    "PhoneNumber" character varying(50),
    "PhoneNumberConfirmed" boolean,
    "TwoFactorEnabled" boolean,
    "LockoutEnd" timestamptz,
    "LockoutEnabled" boolean,
    "AccessFailedCount" integer,
    CONSTRAINT users_id_pkey PRIMARY KEY ("Id"),
    CONSTRAINT users_email_unq UNIQUE ("NormalizedEmail"),
    CONSTRAINT users_username_unq UNIQUE ("NormalizedUserName")
);

ALTER TABLE users OWNER to "NotesAppUser";
GRANT ALL ON TABLE users TO "NotesAppUser";

CREATE TABLE if NOT EXISTS notes
(
	"Id" serial not null,
	"UserId" integer not null,
	"Guid" uuid not null,
	"Name" varchar(100),
	"CreationDate" timestamptz not null,
	"ModifyDate" timestamptz not null,
	"Content" text,
	constraint notes_Id_pkey primary key ("Id"),
	constraint notes_UserId_fkey foreign key ("UserId") references users("Id")
);

ALTER TABLE notes OWNER to "NotesAppUser";
GRANT ALL ON TABLE notes TO "NotesAppUser";

CREATE OR REPLACE PROCEDURE delete_account (IN userId int)
language sql
AS $$
	DELETE FROM notes WHERE notes."UserId" = userId;
	DELETE FROM users WHERE users."Id" = userId;	
$$

\q