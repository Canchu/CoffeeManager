#!/usr/bin/python
# -*- coding: utf-8 -*-

import time
import requests
import json

import RPi.GPIO as GPIO

from so1602a import SO1602A
from nfcreader import nfcReader

def getUsername(nfc_id):
	uri = 'http://127.0.0.1:3000/api/get/username'
	params = {'id': nfc_id}
	response = requests.get(uri, params = params)

	return response


def postPayment(nfc_id, drink):
	uri = 'http://127.0.0.1:3000/api/post/payment'
	datetime_jst = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
	header = {'Content-Type': 'application/json; charset=utf-8'}
	payload = {
		'id': nfc_id,
		'date': datetime_jst,
		'drink': str(drink)
	}
	response = requests.post(uri, data = json.dumps(payload), headers = header)

	return response

def beep(pin, num = 2):
	for i in range(num):
		GPIO.output(27, 1)
		time.sleep(0.08)
		GPIO.output(27, 0)
		time.sleep(0.03)

def main():
	GPIO.setmode(GPIO.BCM)
	GPIO.setup(27, GPIO.OUT)
	GPIO.setup(24, GPIO.IN, pull_up_down = GPIO.PUD_UP)

	oled = SO1602A(sa0 = 0)
	oled.writeLine('Please touch', line = 0)
	oled.writeLine('your ID card', line = 1, align = 'right')

	reader = nfcReader()
	reader.waitContact()
	beep(27)

	name = str(getUsername(reader.id).json()['name'])

	oled.writeLine('Hello ' + name)
	oled.writeLine('Choose ur drink', line = 1)

	while GPIO.input(24) == 1:
		pass
	
	res = postPayment(reader.id, 1)

	oled.clearDisplay()
	oled.writeLine('Thank you!')
	beep(27, 3)

	GPIO.cleanup()

if __name__ == '__main__':
	main()
