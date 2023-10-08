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

CREATE TABLE IF NOT EXISTS public.notes
(
    "Id" serial,
    "Name" character varying(100) COLLATE pg_catalog."default",
    "Creation_Date" date,
    "Modify_Date" date,
    "Content" text COLLATE pg_catalog."default",
    CONSTRAINT notes_pkey PRIMARY KEY ("Id")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.notes
    OWNER to "NotesAppUser";

GRANT ALL ON TABLE public.notes TO "NotesAppUser";

INSERT INTO public.notes ("Name", "Creation_Date", "Modify_Date", "Content") VALUES 
('Note One',    '2023-01-01', '2023-01-01', 'Most of the buttons do no''t work for now'),
('Note Two',    '2023-02-02', '2023-02-02', 'Reminder to do something'),
('Note Three',  '2023-03-03', '2023-03-03', 'Buy carrots'),
('Note Four',   '2023-04-04', '2023-04-04', 'aaaaaaaaaaaaaaaaaaa'),
('Note Five',   '2023-05-05', '2023-05-05', 'this is a longer text that I am writting to test this but I have no idea what I am writting'),
('Note Six',    '2023-06-06', '2023-06-06', ''),
('Note Seven',  '2023-07-07', '2023-07-07', ''),
('Note Eight',  '2023-08-08', '2023-08-08', ''),
('Note Nine',   '2023-09-09', '2023-09-09', ''),
('Note Ten',    '2023-10-10', '2023-10-10', ''),
('Note Eleven', '2023-11-11', '2023-11-11', ''),
('Note Twelve', '2023-12-12', '2023-12-12', '');

\q