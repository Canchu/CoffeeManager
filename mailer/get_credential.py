#!/usr/bin/python
#coding: utf-8

# from __future__ import print_function
import httplib2
import os

from apiclient import discovery
import oauth2client
from oauth2client import client
from oauth2client import tools

from email.MIMEText import MIMEText
from email.Header import Header
import base64

try:
	import argparse
	flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
except ImportError:
	flags = None

charset = 'utf-8'

# If modifying these scopes, delete your previously saved credentials
# at ~/.credentials/gmail-python-quickstart.json
SCOPES = 'https://www.googleapis.com/auth/gmail.send'
CLIENT_SECRET_FILE = 'client_secret.json'
APPLICATION_NAME = 'Gmail API Python Quickstart'

def get_credentials():
	"""Gets valid user credentials from storage.

	If nothing has been stored, or if the stored credentials are invalid,
	the OAuth2 flow is completed to obtain the new credentials.

	Returns:
		Credentials, the obtained credential.
	"""
	home_dir = os.path.expanduser('~')
	credential_dir = os.path.join(home_dir, '.credentials')
	if not os.path.exists(credential_dir):
		os.makedirs(credential_dir)
	credential_path = os.path.join(credential_dir, 'voguecafe-mailer.json')

	store = oauth2client.file.Storage(credential_path)
	credentials = store.get()
	if not credentials or credentials.invalid:
		flow = client.flow_from_clientsecrets(CLIENT_SECRET_FILE, SCOPES)
		flow.user_agent = APPLICATION_NAME
		if flags:
			credentials = tools.run_flow(flow, store, flags)
		else: # Needed only for compatibility with Python 2.6
			credentials = tools.run(flow, store)
		print('Storing credentials to ' + credential_path)
	return credentials

def createMessage(to, subject, message_text):
	message = MIMEText(message_text, 'plain', charset)
	message['From'] = 'cafe@vogue.is.uec.ac.jp'
	message['To'] = to
	message['Subject'] = Header(subject, charset)
	print('Created Message:')
	print(message)
	return { 'raw': base64.urlsafe_b64encode(message.as_string()) }

def sendMessage(service, user_id, message):
	"""Send an email message.

	Args:
	service: Authorized Gmail API service instance.
	user_id: User's email address. The special value "me"
	can be used to indicate the authenticated user.
	message: Message to be sent.

	Returns:
	Sent Message.
	"""
	try:
		message = (service.users().messages().send(userId=user_id, body=message).execute())
		print 'Message Id: %s' % message['id']
		return message
	except errors.HttpError, error:
		print 'An error occurred: %s' % error

def main():
	"""Shows basic usage of the Gmail API.

	Creates a Gmail API service object and outputs a list of label names
	of the user's Gmail account.
	"""
	credentials = get_credentials()
	http = credentials.authorize(httplib2.Http())
	service = discovery.build('gmail', 'v1', http=http)

	to = 'cafe@vogue.is.uec.ac.jp'
	subject = u'ご利用料金のお知らせ'

	mail_first = (
		u'いつもVogueCafeをご利用頂きありがとうございます。\n'
		u'5月度のご利用料金のお知らせです。\n' )

	mail_end = (
		u'今後ともVogueCafeをよろしくお願い致します。\n' )

	body = mail_first + (
		u'\n'
		u'uhey様の5月度のご利用料金は、1500円です。\n'
		u'きっちり耳を揃えてお支払いください。\n'
		u'\n' ) + mail_end

	mail = createMessage(to, subject, body)
	print(mail)
	msg = sendMessage(service, 'me', mail)
	print(msg)

if __name__ == '__main__':
	main()
