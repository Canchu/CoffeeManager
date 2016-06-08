#!/usr/bin/python
# -*- coding: utf-8 -*-

import nfc

class nfcReader():
	def __init__(self):
		self.clf = nfc.ContactlessFrontend('usb')

	def waitContact(self):
		self.clf.connect(rdwr = {'on-connect': self.connected})

	def connected(self, tag):
		self.id = tag.identifier.encode("hex").upper()

def main():
	reader = nfcReader()
	reader.waitContact()
	print reader.id

if __name__ == '__main__':
	main()
