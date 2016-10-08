# データベース設計

## データベース
```
CREATE DATABASE CoffeeManager;
```

## テーブル
<dl>
  <dt>Journal</dt>
  <dd>購入ログ</dd>
  <dt>Drinks</dt>
  <dd>飲み物の種類と価格</dd>
  <dt>Users</dt>
  <dd>登録済みユーザー名とNFCID、メールアドレス</dd>
</dl>

```
create table Journal (
  date DATETIME not null primary key,
  username varchar(16),
  item text not null,
  price int not null,
  paid boolean not null
);

create table Drinks (
  id int not null primary key,
  name varchar(32) not null,
  price int not null
);

create table Users (
  id varchar(32) not null primary key,
  username varchar(16) not null,
  email varchar(128) not null
);
```

## ユーザー
<dl>
  <dt>Admin</dt>
  <dd>全権限。価格変更やユーザー登録など。</dd>
  <dt>Manager</dt>
  <dd>普段使い用</dd>
</dl>

```
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'passwd';
GRANT ALL ON CoffeeManager.* TO 'admin'@'localhost';

CREATE USER 'manager'@'localhost' IDENTIFIED BY 'passwd';
GRANT INSERT, SELECT ON CoffeeManager.Journal to 'manager'@'localhost';
GRANT SELECT ON CoffeeManager.Drinks to 'manager'@'localhost';
GRANT SELECT ON CoffeeManager.Users to 'manager'@'localhost';
```
