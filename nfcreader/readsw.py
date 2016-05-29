#!/usr/bin/python
# -*- coding: utf-8 -*-

import RPi.GPIO as GPIO
import time

sw = [17, 23, 24, 27]

def initGPIO():
    GPIO.setmode(GPIO.BCM)
    for i in range(len(sw)):
        GPIO.setup(sw[i], GPIO.IN)

while True:
    var = GPIO.input(17)
    if (var < 1):
        print 'Switch is pushed'
        break

GPIO.cleanup()
