import json;
from flask import Flask, request, jsonify;
from flask_cors import CORS, cross_origin;
from pathlib import Path

app = Flask(__name__)
CORS(app)

@app.route('/winnerInfo', methods=['PUT'])
def create_record():
    record = json.loads(request.data)
    filePath = Path("winnerData/highScore.json")
    filePath.touch(exist_ok= True)
    
    with open('winnerData/highScore.json','r+') as file:
            data = file.read()
            if not data:
                  new_data = [record]
                  file.seek(0)
                  json.dump(new_data, file, indent = 4)
                  file.close()
                  return jsonify(new_data)
            else:
                    with open('winnerData/highScore.json', 'r+') as f: 
                            file_data = json.load(f)
                            file_data.append(record)
                            f.seek(0)
                            f.write(json.dumps(file_data, indent=2))
                            f.close()
                            return jsonify(file_data)
    
    

app.run(debug=True)