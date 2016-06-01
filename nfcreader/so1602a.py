#!/usr/bin/python
# -*- coding: utf-8 -*-

class SO1602A():
	"""docstring for SO1602A"""

	import smbus
	import time

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

	def writeStr(self, str = '', line = 0):
		if (line == 1):
			self.bus.write_byte_data(self.addr, 0x00, (0x80 + 0x20))
		else:
			self.bus_write_byte_data(self.addr, 0x00, 0x01)

		for i in range(len(str)):
			self.bus.write_byte_data(self.addr, 0x40, ord(str[i]))
			time.sleep(0.05)

	def clearDisp(self):
		pass

def main():
	pass

if __name__ == '__main__':
	main()