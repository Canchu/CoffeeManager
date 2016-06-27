#!/usr/bin/python
# -*- coding: utf-8 -*-

import MySQLdb
import requests
import time

import RPi.GPIO as GPIO

from so1602a import SO1602A
from nfcreader import nfcReader

TABLE_NAME = 'test_id';
SQL_SECRET_FILE = '../secrets/sql_secret.json'

def getUsername(nfc_id):
	uri = 'http://127.0.0.1:3000/api/get/username'
	params = {'id': nfc_id}
	response = requests.get(uri, params = params)

	username = str(response.json()['name'])

	return username

def beep(pin, num = 2, err = False):
	if (err):
		for i in range(num):
			GPIO.output(pin, 1)
			time.sleep(0.2)
			GPIO.output(pin, 0)
			time.sleep(0.05)
	else:
		for i in range(num):
			GPIO.output(pin, 1)
			time.sleep(0.08)
			GPIO.output(pin, 0)
			time.sleep(0.03)

def main():
	bell = 27

	GPIO.cleanup()
	
	GPIO.setmode(GPIO.BCM)
	GPIO.setup(bell, GPIO.OUT)

	oled = SO1602A(sa0 = 0)
	reader = nfcReader()

	oled.writeLine('Please touch', line = 0)
	oled.writeLine('your ID card', line = 1, align = 'right')

	reader.waitContact()

	name = getUsername(reader.id)
	
	if (name == 'unregistered'):
		beep(bell)

		oled.clearDisplay()
		oled.displayOff()

		print 'please input your username'
		username = raw_input()

		print 'please input your email'
		email = raw_input()

		f = open(SQL_SECRET_FILE, 'r')
		sql_info = json.load(f)

		connection = MySQLdb.connect(
			host = sql_info['host'],
			db = sql_info['dbname'],
			user = sql_info['user'],
			passwd = sql_info['passwd'])
		cursor = connection.cursor()

		sql = "INSERT INTO %s (id, name, email) VALUES ('%s', '%s', '%s')" % (TABLE_NAME, reader.id, username, email)
		print(cursor.execute(sql))
		connection.commit()

		cursor.close()
		connection.close()
	else:
		beep(bell, err = True)
		print 'Already registered'
		print '%5s: %s' % ('Name', name)
		print '%5s: %s' % ('ID', reader.id)
		oled.clearDisplay()
		oled.displayOff()
	
	GPIO.cleanup()

if __name__ == '__main__':
	main()
