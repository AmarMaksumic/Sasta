import os
import datetime
import pytz
import json
import uuid
from json_operators import read_json, write_json
from flask import Flask, render_template, request, redirect
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static'
application = app
scheduler = BackgroundScheduler()

UTC = pytz.utc

user_uuid = {};

@app.route('/')
def home():
  return 'hello world!'

@app.route('/wake')
def wake():
  return 'hello!'

@app.route('/login', methods=['GET', 'POST'])
def login():
  users = read_json('users.json')
  for user, data in users.items():
    if request.form['username'] == user and request.form['password'] == data['password']:
      print(user + 
            ' logged in at ' + 
            datetime.datetime.now(UTC).strftime("%d/%m/%Y %H:%M:%S") + 
            ' UTC')
      id = uuid.uuid4()
      user_uuid[user] = {'id': id, 'time': datetime.datetime.now(UTC).strftime("%d/%m/%Y %H:%M:%S")} 
      print(user_uuid)
      return json.dumps({'trees': data['trees'], 'user': user, 'uuid': str(id)})
  return 'denied'

@app.route('/signout', methods=['POST'])
def signout():
  print('hi')
  print(request.json)
  logout(request.json['username'])
  print(request.json['username'] + 
        ' logged out at ' + 
        datetime.datetime.now(UTC).strftime("%d/%m/%Y %H:%M:%S") + 
        ' UTC')
  return 'Signed out!'

@app.route('/signup', methods=['POST'])
def signup():
  return 'hi!'
  #TODO

@app.route('/is_logged', methods=['POST'])
def is_logged():
  return str(verify_session(request.json['username'], request.json['uuid']))

@app.route('/request_tree', methods=['POST'])
def request_tree():
  trees = read_json('trees.json')
  print(request.json)
  if verify_session(request.json['username'], request.json['uuid']) and user_in_tree(request.json['username'], request.json['tree']):
    return json.dumps(trees[request.json['tree']])
  return 'denied'

@app.route('/request_edit', methods=['POST'])
def request_edit():
  trees = read_json('trees.json')
  print(request.json)
  if user_in_tree(request.json['username'], request.json['tree']):
    trees[request.json['tree']]['individuals'][0][request.json['individual']] = request.json['new_data'] #.individuals[0].request.json['individual']) #print(request.json['new_data'])
    print(trees[request.json['tree']]['individuals'][0][request.json['individual']])
  write_json(trees, 'trees.json');
  return 'complete'

@app.route('/request_add', methods=['POST'])
def request_add():
  trees = read_json('trees.json')
  print(request.json)
  if user_in_tree(request.json['username'], request.json['tree']):

    trees[request.json['tree']]['individuals'][0][trees[request.json['tree']]['next_individual']] = request.json['new_data']

    trees[request.json['tree']]['next_individual'] += 1

  write_json(trees, 'trees.json');
  return 'complete'


def expire_session():
  remove = []

  for user in user_uuid:
    end_time = datetime.datetime.strptime(user_uuid[user]['time'], "%d/%m/%Y %H:%M:%S") + datetime.timedelta(hours=1)
    if end_time < datetime.datetime.now():
      remove.append(user)
  
  for user in remove:
    user_uuid.pop(user)

  print(user_uuid)

def verify_session(username, id):
  for user in user_uuid:
    if username == user and id == str(user_uuid[user]['id']):
      return True
  return False

def tree_exist(tree_id):
  tree_id = str(tree_id)
  trees = read_json('trees.json')
  if tree_id in trees:
    return True
  return False

def user_in_tree(username, tree_id):
  tree_id = str(tree_id)
  trees = read_json('trees.json')
  if tree_exist(tree_id):
    if username in trees[tree_id]['members']:
      return True
  return False

def logout(username):
  for user in user_uuid:
    if username == user:
      user_uuid.pop(user)
      return

def run():
  print('starting flask...')
  app.secret_key = os.urandom(12)
  scheduler.start()
  scheduler.add_job(expire_session, 'interval', minutes=5)
  app.run(host='0.0.0.0', port=8080)