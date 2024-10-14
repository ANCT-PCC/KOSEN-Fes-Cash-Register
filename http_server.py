import os

from flask import Flask , request
from flask_cors import CORS
from datetime import datetime
from flask_socketio import SocketIO, emit

app = Flask(__name__, static_folder='.', static_url_path='')
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

CSV_FILE_NAME = "sales_data.csv"
display_data = []
print("サーバー開始")

def write_csv(filepointer,data,amount):
    if(amount!="0"):
        filepointer.write(data)

@app.route('/')
def index():
    return app.send_static_file('main.html')

@app.route('/display',methods=['GET','POST'])
def display():
    if request.method == 'POST':
        print(request.json)
        socketio.emit('message', {'data': request.json})
    return app.send_static_file('display.html')

@app.route('/csv',methods=['GET','POST'])
def csv():
    now_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(request.json)
    for flag in range(len(request.json)):
        res = request.json[flag]
        item_name = res['name']
        item_amount = res['amount']
        item_subtotal = res['subtotal']

        isfile_res=os.path.isfile(CSV_FILE_NAME)
        display_data.append(res)

        if(isfile_res == False):
            with open(CSV_FILE_NAME,"w",encoding="UTF-8") as fp_unko:
                fp_unko.write('日時,商品名,個数,小計'+"\n")
                write_csv(fp_unko,f"{now_time},{item_name},{item_amount},{item_subtotal}"+"\n",item_amount)
        
        if(isfile_res == True):
            with open(CSV_FILE_NAME,"a",encoding="UTF-8") as fp:
                write_csv(fp,f"{now_time},{item_name},{item_amount},{item_subtotal}"+"\n",item_amount)

    socketio.emit('message', {'data': display_data})
    display_data.clear()
    return "OK",200

@app.route('/end',methods=['GET'])
def exit_program():
    exit()

@socketio.on('connect')
def connect():
    print('connect')
    emit('connected', {'data': 'Connected'})

@socketio.on('disconnect')
def disconnect():
    print('disconnect')

@socketio.on('message')
def register(data):
    print(data)
    print(type(data))
    emit('message', data, broadcast=True)

@app.route('/test',methods=['POST'])
def test():
    return request.get_data()

socketio.run(app,port=8000, debug=True)
