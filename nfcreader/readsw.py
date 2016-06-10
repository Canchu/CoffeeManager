#!/usr/bin/python
# -*- coding: utf-8 -*-

import RPi.GPIO as GPIO
import time

def initSwitches(sw):
    GPIO.setmode(GPIO.BCM)
    for i in range(len(sw)):
        GPIO.setup(sw[i], GPIO.IN)

def readSwitches(sw):
	state = []
	for i in range(len(sw)):
		state.append = GPIO.input(sw[i])
	return state

def wateSwitches(sw):
	state = []
	while True:
		state = readSwitches(sw)
		if (0 in state):
			return state.index(0)

def main():
	sw = [17, 23, 24, 27]
	initSwitches(sw)
	sw_id = wateSwitches(sw)
	print 'Switch' + str(sw_id) + ' is pushed.'
	GPIO.cleanup()

if __name__ == '__main__':
	main()
