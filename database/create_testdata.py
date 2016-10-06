# coding:utf-8
import random
import time

# startからendの間でランダムな日付生成
def randomDate(start, end):
    format = '%Y-%m-%d %H:%M:%S'
    stime = time.mktime(time.strptime(start, format))
    etime = time.mktime(time.strptime(end, format))
    ptime = stime + random.random() * (etime - stime)
    return time.strftime(format, time.localtime(ptime))

DRINK_LIST = [ 'Barista', 'Dolce Gusto', 'Dolce Gusto with Milk', 'Special T', 'Iced Coffee' ]

PRICE_LIST = {
    'Barista': 30,
    'Dolce Gusto': 60,
    'Dolce Gusto with Milk': 120,
    'Special T': 60,
    'Iced Coffee': 50
}

NAME_LIST = [ 'uhey', 'yoshida', 'okano', 'minagawa', 'umesh' ]

ID_LIST = {
    'uhey': '00112233',
    'yoshida': '44556677',
    'okano': '8899AABB',
    'minagawa': 'CCDDEEFF',
    'umesh': '01234567'
}

# 出力するファイル名
OUTPUT_FILE = "TestData.sql"
OUTPUT_FILE_ID = "TestData_ID.sql"

sqlCommands_id = "USE CoffeeManager_db;\n"

for name in NAME_LIST:
    sqlCommands_id += "INSERT INTO Users " \
        "(id, name, email)" \
        "VALUES ('{}', '{}', '{}');\n" \
        .format(ID_LIST[name], name, ("konbu.su+" + name + "@gmail.com"))

f = open(OUTPUT_FILE_ID, 'w')
f.write(sqlCommands_id)
f.close()

# 登録するデータ件数
RECORD_COUNT = 100

# 実行するSQLコマンド文字列
sqlCommands = ""

# 使用するデータベースを指定(今回はCreateTestData)
sqlCommands += "USE CoffeeManager_db;\n"

# 登録するデータの数だけINSERT文を生成
for _ in range(RECORD_COUNT):

    # 登録するランダムなデータの生成
    date = randomDate("2016-8-1 00:00:00", "2016-8-30 23:59:59")
    name = random.choice(NAME_LIST)
    drink = random.choice(DRINK_LIST)
    price = PRICE_LIST[drink]

    # ランダムなデータからInsert文を生成
    sqlCommands += "INSERT INTO Journal " \
    "(time, name, item, price) " \
    "VALUES ('{}', '{}', '{}', '{}');\n"\
    .format(date, name, drink, price)

for _ in range(RECORD_COUNT):

    # 登録するランダムなデータの生成
    date = randomDate("2016-9-1 00:00:00", "2016-9-30 23:59:59")
    name = random.choice(NAME_LIST)
    drink = random.choice(DRINK_LIST)
    price = PRICE_LIST[drink]

    # ランダムなデータからInsert文を生成
    sqlCommands += "INSERT INTO Journal " \
    "(time, name, item, price) " \
    "VALUES ('{}', '{}', '{}', '{}');\n"\
    .format(date, name, drink, price)

# 生成したSQLコマンドをファイルに書き出す
f = open(OUTPUT_FILE, 'w')
f.write(sqlCommands)
f.close()
