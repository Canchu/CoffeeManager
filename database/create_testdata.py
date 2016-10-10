# coding:utf-8
import random
import time
import string
import hashlib

# startからendの間でランダムな日付生成
def randomDate(start, end):
    format = '%Y-%m-%d %H:%M:%S'
    stime = time.mktime(time.strptime(start, format))
    etime = time.mktime(time.strptime(end, format))
    ptime = stime + random.random() * (etime - stime)
    return time.strftime(format, time.localtime(ptime))

def randomStr(length):
    return ''.join([random.choice(string.ascii_letters + string.digits) for i in range(length)])

def randomStrHex(length):
    return ''.join([random.choice(string.hexdigits) for i in range(length)])

DRINK_LIST = [ 'Barista', 'Dolce Gusto', 'Dolce Gusto w/ Milk', 'Special T', 'Iced Coffee' ]

PRICE_LIST = {
    'Barista': 30,
    'Dolce Gusto': 60,
    'Dolce Gusto w/ Milk': 120,
    'Special T': 60,
    'Iced Coffee': 50
}

NAME_LIST = [ 'uhey', 'yoshida', 'okano', 'minagawa', 'umesh', 'marchall', 'setsu' ]
ID_LIST = {}
for name in NAME_LIST:
    ID_LIST[name] = randomStrHex(16)
PW_LIST = {}
for name in NAME_LIST:
    tmp = randomStr(8)
    hash = hashlib.sha256()
    hash.update(tmp)
    PW_LIST[name] = hash.hexdigest()

# 出力するファイル名
OUTPUT_FILE = "TestData.sql"
OUTPUT_FILE_ID = "TestData_ID.sql"

sqlCommands_id = ""
for name in NAME_LIST:
    sqlCommands_id += "INSERT INTO Users " \
        "(id, name, email, password) " \
        "VALUES ('{}', '{}', '{}', '{}');\n" \
        .format(ID_LIST[name], name, ("konbu.su+" + name + "@gmail.com"), PW_LIST[name])

f = open(OUTPUT_FILE_ID, 'w')
f.write(sqlCommands_id)
f.close()

# 登録するデータ件数
RECORD_COUNT = 200
MONTH_LIST = ['6', '7', '8', '9']

# 実行するSQLコマンド文字列
sqlCommands = ""

# 登録するデータの数だけINSERT文を生成
for month in MONTH_LIST:
    for _ in range(RECORD_COUNT):

        # 登録するランダムなデータの生成
        date = randomDate('2016-' + month + '-1 00:00:00', '2016-' + month + '-30 23:59:59')
        name = random.choice(NAME_LIST)
        drink = random.choice(DRINK_LIST)
        price = PRICE_LIST[drink]

        # ランダムなデータからInsert文を生成
        sqlCommands += "INSERT INTO Journal " \
        "(time, name, item, price, paid) " \
        "VALUES ('{}', '{}', '{}', '{}', false);\n"\
        .format(date, name, drink, price)

# 生成したSQLコマンドをファイルに書き出す
f = open(OUTPUT_FILE, 'w')
f.write(sqlCommands)
f.close()
