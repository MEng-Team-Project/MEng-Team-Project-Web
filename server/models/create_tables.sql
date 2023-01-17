CREATE TABLE IF NOT EXISTS "streams" (
	"name"	TEXT NOT NULL UNIQUE,
	"source"	TEXT NOT NULL UNIQUE,
	"running"	INTEGER NOT NULL,
    "is_livestream" INTEGER NOT NULL,
	PRIMARY KEY("name","source")
);

/*INSERT INTO streams VALUES ("testlive", "2432.242.23", 0, 1);
INSERT INTO streams VALUES ("testvid", "this/test/testvid.mp4", 0, 0);
DELETE FROM streams WHERE name = "testlive";
UPDATE streams SET source="newtestsource" WHERE name ="newtest";
*/