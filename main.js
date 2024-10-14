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
  var deposit_element_placed = null;
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
  var is_placed = false;
  var new_item_title_element = null;
  var new_item_price_element = null;
  var new_item_subtotal_element = null;
  var new_label_price_element = null;
  var new_label_quantity_element = null;
  var last_element = null;
  const new_br_element = document.createElement('br');

  var prev_element = null;
  var subtotal_position = null;

  const init = () => {
    for(flag = 0;flag<iteminfo.length;flag++){
      if(init_count == 0){
        //商品名
        new_item_title_element = document.createElement('h3');
        new_item_title_element.textContent = iteminfo[flag].name;
        new_item_title_element.id = 'item_title'+String(flag);
        new_item_title_element.style.fontWeight = "bold";
        new_item_title_element.className = "mt-2";

        //単価
        new_label_price_element = document.createElement('label');
        new_label_price_element.textContent = '単価';
        new_label_price_element.className = 'm-1';
        new_item_price_element = document.createElement('input');
        new_item_price_element.className = 'form-control';
        new_item_price_element.type = 'text';
        new_item_price_element.ariaLabel = "Disabled input example";
        new_item_price_element.disabled = true;
        new_item_price_element.style.width = "20%";
        new_item_price_element.value = iteminfo[flag].price;

        //数量
        new_label_quantity_element = document.createElement('span');
        new_label_quantity_element.textContent = '数量';
        new_label_quantity_element.className = "input-group-text"
        new_item_quantity_element = document.createElement('input');
        new_item_quantity_element.className = 'form-control';
        new_item_quantity_element.id = 'item_quantity'+String(flag);
        new_item_quantity_element.type = 'number';
        new_item_quantity_element.value = '0';
        new_item_quantity_element.min = '0';
        

        //小計
        new_label_subtotal_element = document.createElement('label');
        new_label_subtotal_element.textContent = '小計';
        new_label_subtotal_element.id = 'label_subtotal'+String(flag);
        new_item_subtotal_element = document.createElement('input');
        new_item_subtotal_element.id = 'subtotal'+String(flag);
        new_item_subtotal_element.className = 'form-control';
        new_item_subtotal_element.disabled = true;
        new_item_subtotal_element.ariaLabel = "Disabled input example";
        new_item_subtotal_element.type = 'text';
        new_item_subtotal_element.placeholder = '0';
        new_item_subtotal_element.style.width = "20%";

        //divその2
        new_div_element2 = document.createElement('div');
        new_div_element2.className = 'input-group input-group-lg m-1';
        new_div_element2.id = 'div2'+String(flag);
        new_div_element2.appendChild(new_label_quantity_element);
        new_div_element2.appendChild(new_item_quantity_element);
        new_div_element2.style.width = "20%";

        //divその1
        new_div_element = document.createElement('div');
        new_div_element.className = 'd-flex';
        new_div_element.id = 'main_div'+String(flag);
        new_div_element.appendChild(new_label_price_element);
        new_div_element.appendChild(new_item_price_element);
        new_div_element.appendChild(new_br_element);
        new_div_element.appendChild(new_br_element);
        new_div_element.appendChild(new_label_subtotal_element);
        new_div_element.appendChild(new_item_subtotal_element);

        if (flag == 0){
          //site_titleの後ろにぶち込む
          prev_element = document.getElementById('site_title');
          prev_element.after(new_item_title_element);
          prev_element = document.getElementById('item_title'+String(flag));
          //div1をぶち込む
          prev_element.after(new_div_element);

          //div1にdiv2をぶち込む(実際は単価のinput要素の直後にぶち込む)
          subtotal_position = document.getElementById(new_label_subtotal_element.id);
          subtotal_position.parentNode.insertBefore(new_div_element2,subtotal_position);
          
        }else{
          prev_element = document.getElementById('main_div'+String(flag - 1));
          prev_element.after(new_item_title_element);
          prev_element = document.getElementById('item_title'+String(flag));
          //div1をぶち込む
          prev_element.after(new_div_element);

          //div1にdiv2をぶち込む
          subtotal_position = document.getElementById(new_label_subtotal_element.id);
          subtotal_position.parentNode.insertBefore(new_div_element2,subtotal_position);
        }

        //最後に改行を入れる
        last_element = document.getElementById(new_div_element.id);
        if(is_placed == false){
          last_element.insertAdjacentHTML('afterend','<br>');
    }
      }else{
        document.getElementById('item_quantity'+String(flag)).value = "0";
        document.getElementById('subtotal'+String(flag)).placeholder = "0";
        document.getElementById('total').textContent = "0 円";
        document.getElementById('change').textContent = "0 円";
        document.getElementById('deposit').value = "";
      }

      //お預かり金額の入力欄
      if(flag == 0 && is_placed == false){
        new_div_element3 = document.createElement('div');
        new_div_element3.className = 'd-flex';
        new_div_element3.id = 'deposit_div';
        deposit_element_label = document.createElement('span');
        deposit_element_label.textContent = 'お預かり金額を入力';
        deposit_element_label.className = "input-group-text";
        deposit_element = document.createElement('input');
        deposit_element.className = 'form-control';
        deposit_element.id = 'deposit';
        deposit_element.type = 'number';
        deposit_element.value = '';
        new_div_element4 = document.createElement('div');
        new_div_element4.className = 'input-group input-group-lg m-1';
        new_div_element4.id = 'div4';
        new_div_element4.appendChild(deposit_element_label);
        new_div_element4.appendChild(deposit_element);
        new_div_element4.style.width = "30%";
        document.getElementById('money_number_div').after(new_div_element3);
        document.getElementById('deposit_div').appendChild(new_div_element4);
      }
    }

    if(is_placed == false){
      for(flag=0;flag<iteminfo.length;flag++){
        //数量のマウスホイールによる変更
        document.getElementById('item_quantity'+String(flag)).addEventListener('wheel',(e) => {
          e.preventDefault();
          if(e.deltaY > 0){
            document.getElementById(e.target.id).value = String(Number(document.getElementById(e.target.id).value) - 1);
          }else{
            document.getElementById(e.target.id).value = String(Number(document.getElementById(e.target.id).value) + 1);
          }
          //confirm_total();
        });
      }
    }
    is_placed = true;

    total_price = document.getElementById('total');
    change_price = document.getElementById('change');
    change_price.textContent = '0 円';
    total_price.textContent = '0 円';
    send_data_status = document.getElementById('send_data_status');
    send_data_status.style.visibility = "hidden";
    send_data_status_error = document.getElementById('send_data_status_error');
    send_data_status_error.style.visibility = "hidden";

    //ボタンの定義
    $button[0].textContent = '決済する(csvに記録)';
    $button[1].textContent = '金額を確認する';
    $button[2].textContent = '次の会計へ(入力リセット)';
    $button[3].textContent = 'お客様画面を表示する(新しいタブが開きます)';

    if(init_count == 0){
      $button[0].addEventListener('click',(e) => {
        confirm_total();
        //ここに決済関数を
        send_data(no_write=false);
      });
      $button[1].addEventListener('click',(e) => {
        confirm_total();
        send_data(no_write=true);
      });
      $button[2].addEventListener('click',(e) => {
        $.ajax(
          {
            url:'http://localhost:8000/display',
            type:'POST',
            data:JSON.stringify([{name:"all_zero"}]), //ここで辞書型からJSONに変換
            dataType: 'json',
            contentType: 'application/json'
          }).always(function (jqXHR) {
            console.log(jqXHR.status);
            if(String(jqXHR.status) === "200"){
              send_data_status.textContent = "画面をリセットしました。会計を続けてください。\nHTTP Status: "+jqXHR.status;
              send_data_status.style.visibility = "visible";
            }else{
              send_data_status_error.textContent = "お客様画面の更新中にエラーが発生しました。\nHTTP Status: "+jqXHR.status;
              send_data_status_error.style.visibility = "visible";
            }
        }); 
        init();
      });
      $button[3].addEventListener('click',(e) => {
        window.open('http://localhost:8000/display','_blank');
      });
    }

    init_count +=1;
  };
  
  //会計(入力を反映)
  const confirm_total = () => {
    var n = 0;
    total_price.value = '0 円';
    for(flag = 0;flag<iteminfo.length;flag++){
      //小計・合計金額を反映
      subtotal = document.getElementById('subtotal'+String(flag));
      item_quantity = document.getElementById('item_quantity'+String(flag)).value;
      subtotal.placeholder = String(Number(iteminfo[flag].price) * Number(item_quantity));
      subtotal.textContent = subtotal.placeholder;
      n += Number(subtotal.placeholder);
    }
    const formatNumberWithComma = (number) => {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    total_price.textContent = formatNumberWithComma(n) + " 円";
  };

  //CSVに記録(PythonのHTTP鯖にPOST)
  const send_data =(no_write) => {
    //現在の入力状況を辞書型に格納
    var origin_data = [];
    var tupple = {};
    for (flag = 0;flag<iteminfo.length;flag++){
      tupple = {
        name: iteminfo[flag].name,
        amount: String(document.getElementById('item_quantity'+String(flag)).value),
        subtotal: String(document.getElementById('subtotal'+String(flag)).placeholder)
      };
      origin_data.push(tupple);
    }

    if(no_write == true){
      url = 'http://localhost:8000/display';
    }else{
      url = 'http://localhost:8000/csv';
    }

    //通信開始
    $.ajax(
      {
        url:url,
        type:'POST',
        data:JSON.stringify(origin_data), //ここで辞書型からJSONに変換
        dataType: 'json',
        contentType: 'application/json'
      }).always(function (jqXHR) {
        console.log(jqXHR.status);
        if(String(jqXHR.status) === "200"){
          if(no_write == true){
            send_data_status.textContent = "お客様画面を更新しました\nHTTP Status: "+jqXHR.status;
          }else{
            send_data_status.textContent = "記録しました。「次の会計へ」で会計を続けてください\nHTTP Status: "+jqXHR.status;
          }
          send_data_status.style.visibility = "visible";
        }else{
          send_data_status_error.textContent = "記録中になんらかのエラーが発生しました。\nHTTP Status: "+jqXHR.status;
          send_data_status_error.style.visibility = "visible";
        }
    });
  };
  
  init();