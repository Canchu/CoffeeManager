#!/usr/bin/python
# -*- coding: utf-8 -*-

import time

if __name__ == '__main__':
	datetime_jst = time.strftime("%Y/%m/%d %H:%M:%S", time.localtime())
	print datetime_jst