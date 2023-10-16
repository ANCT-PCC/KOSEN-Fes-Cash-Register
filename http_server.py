import os
import json

from flask import Flask , request
app = Flask(__name__, static_folder='.', static_url_path='')

CSV_FILE_NAME = "sales_data.csv"

def write_csv(filepointer,data,amount):
    if(amount!="0"):
        filepointer.write(data)

@app.route('/')
def index():
    return app.send_static_file('main.html')

@app.route('/csv',methods=['GET','POST'])
def csv():
    for flag in range(4):
        res = request.json[flag]
        item_name = res['name']
        item_amount = res['amount']
        item_subtotal = res['subtotal']

        isfile_res=os.path.isfile(CSV_FILE_NAME)

        if(isfile_res == False):
            with open(CSV_FILE_NAME,"w",encoding="UTF-8") as fp_unko:
                fp_unko.write('商品名,個数,小計'+"\n")
                write_csv(fp_unko,f"{item_name},{item_amount},{item_subtotal}"+"\n",item_amount)
        
        if(isfile_res == True):
            with open(CSV_FILE_NAME,"a") as fp:
                write_csv(fp,f"{item_name},{item_amount},{item_subtotal}"+"\n",item_amount)


    return "OK"

@app.route('/test',methods=['POST'])
def test():
    return request.get_data()

app.run(port=8000)