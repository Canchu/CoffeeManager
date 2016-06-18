#!/usr/bin/python
#coding: utf-8

import os
import json
import MySQLdb
from datetime import datetime

from pprint import pprint

SQL_SECRET_FILE = 'sql_secret.json'
TABLE_NAME = 'test'
TABLE_NAME_ID = 'test_id'
TABLE_NAME_DRINKS = 'test_drinks'

f = open(SQL_SECRET_FILE, 'r')
sql_info = json.load(f)

connection = MySQLdb.connect(
	host = sql_info['host'],
	db = sql_info['dbname'],
	user = sql_info['user'],
	passwd = sql_info['passwd'])
cursor = connection.cursor()

def createBill(username, year, month):
	bill = {}
	bill['name'] = username
	bill['subtotal'] = {}

	sql_search_date = "time >= '%04d-%02d-01' and time <= '%04d-%02d-31'" % ( year, month, year, month )

	# get drinks info
	drinks = []
	cmd = "select name from %s;" % TABLE_NAME_DRINKS
	cursor.execute(cmd)
	result = cursor.fetchall()
	for row in result:
		drinks.append(row[0])

	print drinks

	for drink in drinks:
		bill['subtotal'][drink] = [0, 0]
		cmd = (
			"select count(*), coalesce(sum(price), 0) from %s "
			"where name = '%s' and item = '%s' and %s;"
			% ( TABLE_NAME, username, drink, sql_search_date ))
		cursor.execute(cmd)
		result = cursor.fetchone()
		bill['subtotal'][drink][0] = int(result[0])
		bill['subtotal'][drink][1] = int(result[1])

	bill['total'] = [0, 0]
	cmd = (
		"select count(*), coalesce(sum(price), 0) from %s "
		"where name = '%s' and %s;"
		% ( TABLE_NAME, username, sql_search_date ))
	cursor.execute(cmd)
	result = cursor.fetchone()
	bill['total'][0] = int(result[0])
	bill['total'][1] = int(result[1])

	return bill

def main():
	year = datetime.now().year
	month = datetime.now().month - 1
	sql_search_date = "time >= '%04d-%02d-01' and time <= '%04d-%02d-31'" % ( year, month, year, month )
	output_filename = '%04d-%02d.csv' % ( year, month )
	print '%d年%d月の明細' % ( year, month )

	drinks = []
	cmd = "select name from %s;" % TABLE_NAME_DRINKS
	cursor.execute(cmd)
	result = cursor.fetchall()
	for row in result:
		drinks.append(row[0])

	sql = (
		"select count(*), coalesce(sum(price), 0) from %s "
		"where %s;"
		% ( TABLE_NAME, sql_search_date ))
	cursor.execute(sql)
	result = cursor.fetchone()
	print "%d杯 %d円" % ( result[0], result[1] )

	# ユーザー一覧を取得
	sql = 'select name from %s;' % TABLE_NAME_ID
	cursor.execute(sql)
	results = cursor.fetchall()
	users = []
	for row in results:
		users.append(row[0])

	bill = createBill('uhey', 2016, 5)
	pprint(bill)

	cursor.close()
	connection.close()

	# for user in users:
	# 	print '%sさんのご利用明細' % user
	# 	for drink in drinks:
	# 		print '%s: %d杯 %d円' % ( drink, bills[user][drink][0], bills[user][drink][1] )
	# 	print '合計: %d杯 %d円' % ( bills[user]['total'][0], bills[user]['total'][1] )

if __name__ == '__main__':
	main()