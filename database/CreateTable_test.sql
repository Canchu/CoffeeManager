create table test (
	time DATETIME not null primary key,
    name varchar(16),
    item text not null,
    price int 
);

create table test_id (
	id varchar(32) not null primary key,
    name varchar(16) not null,
	email varchar(128) not null
);

create table test_drinks (
	id int not null primary key,
	name varchar(32) not null,
	price int not null
);
