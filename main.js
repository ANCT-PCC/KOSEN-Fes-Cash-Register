//商品情報の定義
const iteminfo = [
    {
      name: "キーホルダー大",
      price: "300",
    },
    {
      name: "キーホルダー小",
      price: "200",
    },
    {
      name: "オリジナルカップ",
      price: "500",
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

  var init_count = 0;
  var new_item_title_element = null;
  var new_item_price_element = null;
  var new_item_subtotal_element = null;
  var new_label_price_element = null;
  var new_label_quantity_element = null;
  const new_br_element = document.createElement('br');

  var prev_element = null;

  const init = () => {
    for(flag = 0;flag<iteminfo.length;flag++){
      //商品名
      new_item_title_element = document.createElement('h3');
      new_item_title_element.textContent = iteminfo[flag].name;
      new_item_title_element.id = 'item_title'+String(flag);

      //単価
      new_label_price_element = document.createElement('label');
      new_label_price_element.textContent = '単価';
      new_item_price_element = document.createElement('input');
      new_item_price_element.className = 'form-control';
      new_item_price_element.type = 'text';
      new_item_price_element.value = iteminfo[flag].price;

      //数量
      new_label_quantity_element = document.createElement('label');
      new_label_quantity_element.textContent = '数量';
      new_item_quantity_element = document.createElement('input');
      new_item_quantity_element.className = 'form-control';
      new_item_quantity_element.type = 'number';
      new_item_quantity_element.value = '0';

      //小計
      new_label_subtotal_element = document.createElement('label');
      new_label_subtotal_element.textContent = '小計';
      new_item_subtotal_element = document.createElement('input');
      new_item_subtotal_element.className = 'form-control';
      new_item_subtotal_element.type = 'text';
      new_item_subtotal_element.placeholder = '0';

      //divその2
      new_div_element2 = document.createElement('div');
      new_div_element2.appendChild(new_label_quantity_element);
      new_div_element2.appendChild(new_item_quantity_element);

      //divその1
      new_div_element = document.createElement('div');
      new_div_element.appendChild(new_label_price_element);
      new_div_element.appendChild(new_item_price_element);
      new_div_element.appendChild(new_div_element2);
      new_div_element.appendChild(new_br_element);
      new_div_element.appendChild(new_br_element);
      new_div_element.appendChild(new_label_subtotal_element);
      new_div_element.appendChild(new_item_subtotal_element);

      //div1にdiv2をぶち込む
      new_div_element.appendChild(new_div_element2);

      if (flag == 0){
        //site_titleの後ろにぶち込む
        prev_element = document.getElementById('site_title');
        prev_element.after(new_item_title_element);
        prev_element = document.getElementById('item_title'+String(flag));
        //div1をぶち込む
        prev_element.after(new_div_element);
      }else{
        prev_element = document.getElementById('item_title'+String(flag - 1));
        prev_element.after(new_item_title_element);
        prev_element = document.getElementById('item_title'+String(flag));
        //div1をぶち込む
        prev_element.after(new_div_element);
      }

    }

    total_price = document.getElementById('total');
    total_price.value = '0';
    send_data_status = document.getElementById('send_data_status');
    send_data_status.style.visibility = "hidden";
    send_data_status_error = document.getElementById('send_data_status_error');
    send_data_status_error.style.visibility = "hidden";

    //ボタンの定義
    $button[0].textContent = '決済する(csvに記録)';
    $button[1].textContent = '入力を反映';
    $button[2].textContent = '次の会計へ(入力リセット)';

    if(init_count == 0){
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
    }

    init_count +=1;
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
      }).always(function (jqXHR) {
        console.log(jqXHR.status);
        if(String(jqXHR.status) === "200"){
          send_data_status.textContent = "CSVの記録に成功しました\nHTTP Status: "+jqXHR.status;
          send_data_status.style.visibility = "visible";
        }else{
          send_data_status_error.textContent = "記録中になんらかのエラーが発生しました。\nHTTP Status: "+jqXHR.status;
          send_data_status_error.style.visibility = "visible";
        }
    });
  };
  
  init();