-- init.sql
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'docker') THEN
        CREATE USER docker;
    END IF;

    IF NOT EXISTS (SELECT FROM pg_catalog.pg_database WHERE datname = 'docker') THEN
        CREATE DATABASE docker;
    END IF;

    GRANT ALL PRIVILEGES ON DATABASE docker TO docker;

    DROP SCHEMA IF EXISTS db CASCADE;
    CREATE SCHEMA db;
    SET search_path TO db;

     CREATE TABLE db.Login (
        Id SERIAL PRIMARY KEY,
        Login VARCHAR(255) NOT NULL,
        Password VARCHAR(255) NOT NULL,
        Pseudo VARCHAR(255)
    );

    CREATE TABLE db.Address (
        Id SERIAL PRIMARY KEY,
        Street VARCHAR(255),
        City VARCHAR(255),
        State VARCHAR(255),
        PostalCode VARCHAR(20),
        Country VARCHAR(100),
        Private BOOLEAN,
        Validate BOOLEAN
    );

    CREATE TABLE db.PersonPhysic (
        Id SERIAL PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        NaissanceDate DATE,
        PhoneNumber VARCHAR(20),
        EmailAddress VARCHAR(255),
        AddressId INT,
        LoginId INT,
        FOREIGN KEY (LoginId) REFERENCES db.Login(Id)
    );

    CREATE TABLE db.PersonMoral (
        Id SERIAL PRIMARY KEY,
        Name VARCHAR(255) NOT NULL
    );

    CREATE TABLE db.Club (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        AddressId INT,
        PersonMoralId INT
    );

    CREATE TABLE db.ProduitType (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        ClubId INT,
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

    CREATE TABLE db.Produit (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        Description TEXT,
        ProduitTypeId INT,
        Dd TIMESTAMP,
        Df TIMESTAMP,
        Price FLOAT,
        Stock INT,
        FOREIGN KEY (ProduitTypeId) REFERENCES db.ProduitType(Id)
    );

    CREATE TABLE db.EventType (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        ClubId INT,
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

    CREATE TABLE db.Event (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        Description TEXT,
        AddressId INT,
        EventTypeId INT,
        Dd TIMESTAMP,
        Df TIMESTAMP,
        InscritIds TEXT,
        FOREIGN KEY (AddressId) REFERENCES db.Address(Id),
        FOREIGN KEY (EventTypeId) REFERENCES db.EventType(Id)
    );

    CREATE TABLE db.LicenceType (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        ClubId INT,
        Price FLOAT,
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

    CREATE TABLE db.Role (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        ClubId INT,
        FOREIGN KEY (ClubId) REFERENCES db.Club(Id)
    );

    CREATE TABLE db.Licence (
        Id SERIAL PRIMARY KEY,
        Label VARCHAR(255) NOT NULL,
        Dd TIMESTAMP,
        Df TIMESTAMP,
        LicenceTypeId INT,
        PersonPhysicId INT,
        RoleId INT,
        FOREIGN KEY (LicenceTypeId) REFERENCES db.LicenceType(Id),
        FOREIGN KEY (PersonPhysicId) REFERENCES db.PersonPhysic(Id),
        FOREIGN KEY (RoleId) REFERENCES db.Role(Id)
    );

    -- Insert test data
    INSERT INTO db.Address (Street, City, State, PostalCode, Country, Private, Validate) VALUES
    ('4 Av. du Stade', 'Bohal', '', '56140', 'France', false, true),
    ('Complexe polyvalent', 'Pleucadeuc', '', '56140', 'France', false, true),
    ('Le Daufresne', 'Malestroit', '', '56140', 'France', false, true);

    INSERT INTO db.PersonMoral (Name) VALUES
    ('Vol en Oust');

    INSERT INTO db.Club (Label, AddressId, PersonMoralId) VALUES
    ('La Claie', 3, null),
    ('Vol en Pleuc', 4, null);

    INSERT INTO db.ProduitType (Label, ClubId) VALUES
    ('Tee-Shirt', 1),
    ('Mug', 1),
    ('Tee-Shirt', 2),
    ('Mug', 2),
    ('SweatShirt', 1),
    ('SweatShirt', 2);

    INSERT INTO db.Produit (Label, Description, ProduitTypeId, Dd, Df, Price, Stock) VALUES
    ('Tee-Shirt La Claie', 'Taille L', 1, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 15, 20),
    ('Tee-Shirt La Claie', 'Taille M', 1, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 15, 20),
    ('Tee-Shirt La Claie', 'Taille S', 1, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 15, 20),
    ('Mug La Claie', 'Mug avec une Capacité de 33cl', 2, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 10, 5),
    ('Tee-Shirt Vol en Pleuc', 'Taille L', 3, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 15, 20),
    ('Tee-Shirt Vol en Pleuc', 'Taille M', 3, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 15, 20),
    ('Tee-Shirt Vol en Pleuc', 'Taille S', 3, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 15, 20),
    ('Mug Vol en Pleuc', 'Mug avec une Capacité de 33cl', 4, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 10, 5),
    ('SweatShirt La Claie', 'Taille L', 5, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 20, 30),
    ('SweatShirt La Claie', 'Taille M', 5, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 20, 30),
    ('SweatShirt La Claie', 'Taille S', 5, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 20, 30),
    ('SweatShirt Vol en Pleuc', 'Taille L', 6, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 20, 30),
    ('SweatShirt Vol en Pleuc', 'Taille M', 6, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 20, 30),
    ('SweatShirt Vol en Pleuc', 'Taille S', 6, '2023-09-01 08:00:00', '2024-08-31 00:00:00', 20, 30);

    INSERT INTO db.EventType (Label, ClubId) VALUES
    ('Entrainement', 1),
    ('Cours', 1),
    ('Tournoi', 1),
    ('Rencontre', 1),
    ('Repas', 1),
    ('Entrainement', 2),
    ('Cours', 2),
    ('Tournoi', 2),
    ('Rencontre', 2),
    ('Repas', 2);

    INSERT INTO db.Event (Label, Description, EventTypeId, Dd, Df, InscritIds) VALUES
    ('Cours', 'Cours le 10/01 à 19h', 2, '2024-01-10 19:00:00', '2024-01-10 21:00:00', ''),
    ('Cours', 'Cours le 12/02 à 19h', 7, '2024-02-12 19:00:00', '2024-02-12 21:00:00', ''),
    ('Cours', 'Cours le 13/03 à 19h', 2, '2024-03-13 19:00:00', '2024-03-13 21:00:00', ''),
    ('Cours', 'Cours le 15/04 à 19h', 7, '2024-04-15 19:00:00', '2024-04-15 21:00:00', ''),
    ('Cours', 'Cours le 15/05 à 19h', 2, '2024-05-15 19:00:00', '2024-05-15 21:00:00', ''),
    ('Cours', 'Cours le 17/06 à 19h', 7, '2024-06-17 19:00:00', '2024-06-17 21:00:00', ''),
    ('Repas', 'Repas de fin d année le 28/06 à 19h', 4, '2024-06-28 19:00:00', '2024-06-28 21:00:00', ''),
    ('Repas', 'Repas de fin d année le 28/06 à 19h', 9, '2024-06-28 19:00:00', '2024-06-28 21:00:00', ''),
    ('Rencontre', 'Rencontre avec Serent', 4, '2024-07-28 19:00:00', '2024-07-28 23:00:00', ''),
    ('Tournois Amical', 'Tournois a Ploermel', 3, '2024-08-28 19:00:00', '2024-08-28 22:30:00', ''),
    ('Cours', 'Cours de fin d année', 2, '2024-08-31 19:00:00', '2024-08-31 22:30:00', '');

    INSERT INTO db.LicenceType (Label, ClubId, Price) VALUES
    ('Licence Adulte', 1, 50),
    ('Licence Jeune', 1, 30),
    ('Licence Adulte', 2, 55),
    ('Licence Jeune', 2, 35);

    INSERT INTO db.Role (Label, ClubId) VALUES
    ('Président', 1),
    ('Trésorier', 1),
    ('Secrétaire', 1),
    ('Membre', 1),
    ('Président', 2),
    ('Trésorier', 2),
    ('Secrétaire', 2),
    ('Membre', 2);

END
$$;