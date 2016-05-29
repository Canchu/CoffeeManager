#!/usr/bin/python
# -*- coding: utf-8 -*-

class SO1602A():
	"""docstring for SO1602A"""
	def __init__(self, sa0):
		if (sa0 == 0):
			self.addr = 0x3c
		else:
			self.addr = 0x3d

	def writeStr(self, str = '', line = 0):
		pass

	def clearDisp(self):
		pass

def main():
	pass

if __name__ == '__main__':
	main()