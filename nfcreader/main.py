#!/usr/bin/python
# -*- coding: utf-8 -*-

import time
import requests

def get_username(nfc_id):
	uri = 'http://127.0.0.1:5000/get'
	params = {'id': nfc_id}
	response = requests.get(uri, params = params)
	return response

if __name__ == '__main__':
	datetime_jst = time.strftime("%Y/%m/%d %H:%M:%S", time.localtime())
	print datetime_jst
