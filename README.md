# 高専祭　会計スクリプト

### システム用件  
OS: Windows/Linux/macOS  
プログラム: Python3.10  
ブラウザ: Google Chrome  
  
### インストール  
1,Python3.10をインストール  
2,「req.txt」から必要なパッケージをインストール  
　pip install -r req.txt  
3,「http_server.py」を実行する。  
　※本番環境ではFlaskの組み込みWeb鯖を使うことは推奨されていないが  
　　まあ、そんなに気にしなくていいし、この方が気が楽だろ。  
4,Chromeで http://localhost:8000 にアクセス  
5,会計する(青のボタンでCSVに記録。その他のボタンはCSVに書き込まない)  

### 注意事項  
1,実行する際はPython仮想環境(Dockerなど)を推奨します  
2,本プログラムは決済端末(PC)のみでの使用を想定しています。  
　※サーバー機で実行してPCからアクセスは想定していない  
3,CSVファイルは、Googleスプレッドシートでの使用を推奨します。  
　※Excelだと文字化けするため。  
4,質問があればDiscord(ユーザー名:networld4816)まで  