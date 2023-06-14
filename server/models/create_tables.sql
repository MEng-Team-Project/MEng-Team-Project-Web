CREATE TABLE IF NOT EXISTS "streams" (
	"name" TEXT NOT NULL UNIQUE,
	"source" TEXT NOT NULL UNIQUE,
	"running" INTEGER NOT NULL,
	"is_livestream" INTEGER NOT NULL,
	"creation_date" TEXT,
	PRIMARY KEY ("name", "source")
);

CREATE TABLE IF NOT EXISTS "livestream_times" (
	"stream_name" TEXT NOT NULL,
	"stream_source" TEXT NOT NULL,
	"start_time" TEXT NOT NULL,
	"end_time" NULL,
	PRIMARY KEY ("stream_name", "stream_source"),
	FOREIGN KEY ("stream_name", "stream_source") REFERENCES "streams"("name", "source")
);

CREATE TABLE IF NOT EXISTS "routes" (
	"stream_name" TEXT NOT NULL,
	"polygon_json" TEXT NOT NULL,
	PRIMARY KEY ("stream_name"),
	FOREIGN KEY ("stream_name") REFERENCES "streams"("name")
);

/*INSERT INTO streams VALUES ("testlive", "2432.242.23", 0, 1);
INSERT INTO streams VALUES ("testvid", "this/test/testvid.mp4", 0, 0);
DELETE FROM streams WHERE name = "testlive";
UPDATE streams SET source="newtestsource" WHERE name ="newtest";
*/