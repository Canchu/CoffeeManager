#!/usr/bin/python
# -*- coding: utf-8 -*-

import MySQLdb
import requests

from so1602a import SO1602A
from nfcreader import nfcReader

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
	oled = SO1602A(sa0 = 0)
	reader = nfcReader()

	oled.writeLine('Please touch', line = 0)
	oled.writeLine('your ID card', line = 1, align = 'right')

	reader.waitContact()

	name = getUsername(reader.id)
	
	if (name == 'unregistered'):
		connection = MySQLdb.connect(db = 'CoffeeManager_db', user = 'user', passwd='NojiNoji')
		cursor = connection.cursor()

		sentence = "insert into test_id (id, name) value ('" + reader.id + "', '" + name + "')"
		print sentence
		cursor.execute(sentence)

		cursor.close()
		connection.close()
	else:
		print 'Already registered'
	
	oled.clearDisplay()
	oled.displayOff()

if __name__ == '__main__':
	main()
