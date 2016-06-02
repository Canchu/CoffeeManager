#!/usr/bin/python
# -*- coding: utf-8 -*-

import nfc

def connected(tag):
    print tag.type
    if isinstance(tag, nfc.tag.tt1.Type1Tag):
        print str(tag.uid).encode("hex")
    elif isinstance(tag, nfc.tag.tt2.Type2Tag):
        print str(tag.uid).encode("hex")
    elif isinstance(tag, nfc.tag.tt3.Type3Tag):
        print 'IDm = ' + str(tag.idm).encode("hex")
    elif isinstance(tag, nfc.tag.tt4.Type4Tag):
        print str(tag.uid).encode("hex")
    else:
        print "error: unknown tag type"

def main():
	clf = nfc.ContactlessFrontend('usb')
	clf.connect(rdwr={'on-connect': connected})

if __name__ == '__main__':
	main()
