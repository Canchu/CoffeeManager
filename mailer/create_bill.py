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

	bill['subtotal'] = []
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
			bill['subtotal'].append([drink, qty, price])

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
		print "%s's bill" % bill['name']
		for sub in bill['subtotal']:
			print "%s: qty %d subtotal %d" % ( sub[0], sub[1], sub[2] )
		print "total: qty %d, %d" % ( bill['total'][0], bill['total'][1] )
		print ''

	cursor.close()
	connection.close()

if __name__ == '__main__':
	main()