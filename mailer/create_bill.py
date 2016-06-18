#!/usr/bin/python
#coding: utf-8

import os
import json
import MySQLdb
from datetime import datetime

SQL_SECRET_FILE = 'sql_secret.json'
TABLE_NAME = 'test_id'

def main():
	year = datetime.now().year
	month = datetime.now().month - 1
	sql_search_date = "time >= '%04d-%02d-01' and time <= '%04d-%02d-31'" % ( year, month, year, month )
	output_filename = '%04d-%02d.csv' % ( year, month )
	print '%d年%d月の明細' % ( year, month )

	f = open(SQL_SECRET_FILE, 'r')
	sql_info = json.load(f)

	connection = MySQLdb.connect(
		host = sql_info['host'],
		db = sql_info['dbname'],
		user = sql_info['user'],
		passwd = sql_info['passwd'])
	cursor = connection.cursor()

	sql = (
		"select count(*), coalesce(sum(value), 0) from test "
		"where %s;"
		% ( sql_search_date ))
	cursor.execute(sql)
	result = cursor.fetchone()
	print "%d杯 %d円" % ( result[0], result[1] )

	# ユーザー一覧を取得
	sql = 'select name from %s;' % TABLE_NAME
	cursor.execute(sql)
	results = cursor.fetchall()
	users = []
	for row in results:
		users.append(row[0])

	drinks = ['Barista', 'Dolce Gusto', 'Dolce Gusto with Milk', 'Special T', 'Iced Coffee']

	# ユーザーごとに明細を作成
	bills = {}
	for user in users:
		bills[user] = {}
		for drink in drinks:
			bills[user][drink] = []
			sql = (
				"select count(*), coalesce(sum(value), 0) from test "
				"where name = '%s' and item = '%s' and %s;"
				% ( user, drink, sql_search_date ))
			cursor.execute(sql)
			result = cursor.fetchone()
			bills[user][drink].append(int(result[0]))
			bills[user][drink].append(int(result[1]))
		sql = (
			"select count(*), coalesce(sum(value), 0) from test "
			"where name = '%s' and %s;"
			% ( user, sql_search_date ))
		cursor.execute(sql)
		result = cursor.fetchone()
		bills[user]['total'] = [int(result[0]), int(result[1])]

	cursor.close()
	connection.close()

	for user in users:
		print '%sさんのご利用明細' % user
		for drink in drinks:
			print '%s: %d杯 %d円' % ( drink, bills[user][drink][0], bills[user][drink][1] )
		print '合計: %d杯 %d円' % ( bills[user]['total'][0], bills[user]['total'][1] )

if __name__ == '__main__':
	main()