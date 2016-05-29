import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.IN)

while True:
    var = GPIO.input(17)
    if (var < 1):
        print 'Switch is pushed'
        break

