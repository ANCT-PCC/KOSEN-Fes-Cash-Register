//商品情報の定義
const iteminfo = [
    {
      name: "キーホルダーA",
      price: "250",
    },
    {
      name: "キーホルダーB",
      price: "300",
    },
    {
      name: "オリジナルカップ",
      price: "600",
    },
    {
      name: "オリジナルゲーム体験",
      price: "0",
    }
  ];

  //合計金額
  var total_price = null;
  var flag = 0;
  //商品名
  var item_name = [];
  //単価
  var item_price = [];
  //数量
  var item_quantity = [];
  //小計
  var subtotals = [];
  //各種ボタン
  const $button = document.querySelectorAll('.btn');

  const init = () => {
    for(flag = 0;flag<4;flag++){
      var identify = flag+1;
      subtotals[flag] = document.getElementById('subtotal'+identify);
      subtotals[flag].placeholder = '0';

      item_price[flag] = document.getElementById('unitp'+identify);
      item_price[flag].placeholder = iteminfo[flag].price;

      item_name[flag] = document.getElementById('item'+identify);
      item_name[flag].textContent = iteminfo[flag].name;

      item_quantity[flag] = document.getElementById('quantity'+identify);
      item_quantity[flag].value = '0';
    }

    total_price = document.getElementById('total');
    total_price.value = '0';

    //ボタンの定義
    $button[0].textContent = '決済する(csvに記録)';
    $button[1].textContent = '入力を反映';
    $button[2].textContent = '次の会計へ(入力リセット)';
    $button[0].addEventListener('click',(e) => {
      confirm_total();
      //ここに決済関数を
      send_data();
    });
    $button[1].addEventListener('click',(e) => {
      confirm_total();
    });
    $button[2].addEventListener('click',(e) => {
      init();
    });
  };
  
  //会計(入力を反映)
  const confirm_total = () => {
    var n = 0;
    total_price.value = '0';
    for(flag = 0;flag<4;flag++){
      //小計・合計金額を反映
      subtotals[flag].placeholder = String(Number(iteminfo[flag].price) * Number(item_quantity[flag].value));
      n += Number(subtotals[flag].placeholder);
    }
    total_price.value = String(n);

  };

  //CSVに記録(PythonのHTTP鯖にPOST)
  const send_data =() => {
    //現在の入力状況を辞書型に格納
    var origin_data = [
      {
        name: String(item_name[0].textContent),
        amount: String(item_quantity[0].value),
        subtotal: String(subtotals[0].placeholder)
      },
      {
        name: String(item_name[1].textContent),
        amount: String(item_quantity[1].value),
        subtotal: String(subtotals[1].placeholder)
      },
      {
        name: String(item_name[2].textContent),
        amount: String(item_quantity[2].value),
        subtotal: String(subtotals[2].placeholder)
      },
      {
        name: String(item_name[3].textContent),
        amount: String(item_quantity[3].value),
        subtotal: String(subtotals[3].placeholder)
      }
    ];

    //通信開始
    $.ajax(
      {
        url:'http://localhost:8000/csv',
        type:'POST',
        data:JSON.stringify(origin_data), //ここで辞書型からJSONに変換
        dataType: 'json',
        contentType: 'application/json'
      })
  };
  
  init();