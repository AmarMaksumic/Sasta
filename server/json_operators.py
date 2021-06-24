import json
from datetime import date

def write_json(data, filename='messages.json'):
  with open(filename,'w+') as f:
    json.dump(data, f, indent=2)
    f.close()

def read_json(filename='messages.json'):
  with open(filename,'r') as f: 
    data = json.load(f)
    f.close
    return data

def serialize(self, obj):
    if isinstance(obj, date):
      serial = obj.isoformat()
      return serial

    return json.JSONEncoder.default(self, obj)