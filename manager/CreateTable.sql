create table test (
	time DATETIME primary key,
    name varchar(255),
    item text not null,
    value int 
);

create table test_id (
	id varchar(255) primary key,
    name varchar(255)
);