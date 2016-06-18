#!/usr/bin/python
#coding: utf-8

import os
import json
import MySQLdb
from datetime import datetime

from pprint import pprint

import httplib2
from apiclient import discovery
import oauth2client
from oauth2client import client
from oauth2client import tools

from get_credential import get_credentials
from get_credential import createMessage
from get_credential import sendMessage

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

def getUsernames():
	users = []
	sql = 'select name from %s;' % TABLE_NAME_ID
	cursor.execute(sql)
	results = cursor.fetchall()
	for row in results:
		users.append(row[0])
	return users

def getDrinks():
	drinks = []
	cmd = "select name from %s;" % TABLE_NAME_DRINKS
	cursor.execute(cmd)
	result = cursor.fetchall()
	for row in result:
		drinks.append(row[0])
	return drinks

def createBill(username, year, month):
	bill = {}
	bill['name'] = username

	cmd = "select email from %s where name = '%s';" % ( TABLE_NAME_ID, username )
	cursor.execute(cmd)
	result = cursor.fetchone()
	bill['email'] = result[0]

	sql_search_date = "time >= '%04d-%02d-01' and time <= '%04d-%02d-31'" % ( year, month, year, month )

	drinks = getDrinks()

	bill['total'] = [0, 0]
	cmd = (
		"select count(*), coalesce(sum(price), 0) from %s "
		"where name = '%s' and %s;"
		% ( TABLE_NAME, username, sql_search_date ))
	cursor.execute(cmd)
	result = cursor.fetchone()
	if (int(result[0]) != 0):
		bill['total'][0] = int(result[0])
		bill['total'][1] = int(result[1])
	else:
		return False

	bill['subtotals'] = []
	for drink in drinks:
		cmd = (
			"select count(*), coalesce(sum(price), 0) from %s "
			"where name = '%s' and item = '%s' and %s;"
			% ( TABLE_NAME, username, drink, sql_search_date ))
		cursor.execute(cmd)
		result = cursor.fetchone()
		if (int(result[0]) != 0):
			qty = int(result[0])
			price = int(result[1])
			bill['subtotals'].append([drink, qty, price])

	return bill

def main():
	year = datetime.now().year
	month = datetime.now().month - 1
	sql_search_date = "time >= '%04d-%02d-01' and time <= '%04d-%02d-31'" % ( year, month, year, month )

	users = getUsernames()

	bills = []
	for user in users:
		bill = createBill(user, year, month)
		if bill:
			bills.append(createBill(user, year, month))
		else:
			continue

	pprint(bills)

	credentials = get_credentials()
	http = credentials.authorize(httplib2.Http())
	service = discovery.build('gmail', 'v1', http=http)

	for bill in bills:
		month = 4
		sbj = "[VogueCafe] %d月度利用料金のお知らせ" % month

		msg = (
			"いつもVogueCafeをご利用頂きありがとうございます。\n"
			"%d年%d月分の料金のお知らせです。\n\n" % ( year, month ))

		msg += "%sさんのご利用明細は以下の通りです。\n\n" % bill['name']
		msg += "-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-\n"

		for sub in bill['subtotals']:
			msg += "%s: %d杯 %d円\n" % ( sub[0], sub[1], sub[2] )
		msg += "\n合計: %d杯 %d円\n" % ( bill['total'][0], bill['total'][1] )
		msg += "-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-\n\n"

		msg += "今後ともVogueCafeをよろしくお願い致します。\n"

		mail = createMessage(
			to = bill['email'],
			subject = unicode(sbj, 'utf-8'),
			message_text = unicode(msg, 'utf-8'))
		sendMessage(service, 'me', mail)
		print msg

	cursor.close()
	connection.close()

if __name__ == '__main__':
	main()