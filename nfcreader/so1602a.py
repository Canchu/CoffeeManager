#!/usr/bin/python
# -*- coding: utf-8 -*-

import smbus
import time

class SO1602A():
	"""docstring for SO1602A"""


	def __init__(self, sa0):
		self.bus = smbus.SMBus(1)

		if (sa0 == 0):
			self.addr = 0x3c
		else:
			self.addr = 0x3d

		self.bus.write_byte_data(self.addr, 0x00, 0x01)
		self.bus.write_byte_data(self.addr, 0x00, 0x02)
		self.bus.write_byte_data(self.addr, 0x00, 0x0e)
		self.bus.write_byte_data(self.addr, 0x00, 0x01)

	def writeLine(self, str = '', line = 0):
		if (line == 1):
			self.bus.write_byte_data(self.addr, 0x00, (0x80 + 0x20))
		else:
			self.bus.write_byte_data(self.addr, 0x00, 0x01)

		for i in range(len(str)):
			self.bus.write_byte_data(self.addr, 0x40, ord(str[i]))
			time.sleep(0.05)

	def clearDisp(self):
		self.bus.write_byte_data(self.addr, 0x00, 0x01)

def main():
	oled = SO1602A(sa0 = 0)
	
	oled.writeLine(str = 'Hello uhey!', line = 0)
	time.sleep(0.5)
	oled.writeLine(str = 'Choose ur drink', line = 1)
	time.sleep(5)
	oled.clearDisp()

if __name__ == '__main__':
	main()
