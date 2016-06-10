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
	GPIO.setmode(GPIO.BCM)
	GPIO.setup(27, GPIO.OUT)
	GPIO.output(27, 0)

	switches = [17, 24]
	states = [1] * len(switches)

	for sw in switches:
		GPIO.setup(sw, GPIO.IN, pull_up_down = GPIO.PUD_UP)
	
	drinks = {
		"17": 0,
		"24": 1
	}

	oled = SO1602A(sa0 = 0)
	reader = nfcReader()

	try:
		while True:
			oled.writeLine('Please touch', line = 0)
			oled.writeLine('your ID card', line = 1, align = 'right')

			reader.waitContact()

			name = str(getUsername(reader.id).json()['name'])

			if (name == 'unregistered'):
				oled.clearDisplay()
				oled.writeLine('ERROR:')
				oled.writeLine('Unregistered ID', line = 1)
				beep(27, err = True)
				time.sleep(2)
				continue

			beep(27)

			oled.writeLine('Hello ' + name)
			oled.writeLine('Choose ur drink', line = 1)

			while True:
				for i, sw in enumerate(switches):
					states[i] = GPIO.input(sw)
				if (states.count(0) == 1):
					drink = states.index(0)
					break
					
			res = postPayment(reader.id, drink)

			oled.clearDisplay()
			oled.writeLine('Thank you!')
			beep(27, 3)

			time.sleep(3)

	except KeyboardInterrupt:
		print 'detect KeyboardInterrupt'

	GPIO.cleanup()
	oled.clearDisplay()
	oled.displayOff()

if __name__ == '__main__':
	main()
