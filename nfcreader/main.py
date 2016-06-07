#!/usr/bin/python
# -*- coding: utf-8 -*-

import time
import requests
import json


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


if __name__ == '__main__':
	datetime_jst = time.strftime("%Y/%m/%d %H:%M:%S", time.localtime())
	print datetime_jst
