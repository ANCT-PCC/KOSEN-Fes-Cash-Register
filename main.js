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
  var n = 0;
  var m = 0;
  var new_item_title_element = null;
  var new_item_price_element = null;
  var new_item_subtotal_element = null;
  var new_label_price_element = null;
  var new_label_quantity_element = null;
  var last_element = null;
  const new_br_element = document.createElement('br');

  var prev_element = null;
  var subtotal_position = null;

  var sound_1 = null;
  var sound_2 = null;
  var sound_3 = null;

  //数字にカンマを入れるやつ
  const formatNumberWithComma = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const init = () => {
    n=0;
    m=0;
    is_confirmed = false;
    for(flag = 0;flag<iteminfo.length;flag++){
      if(init_count == 0){
        //商品名
        new_item_title_element = document.createElement('h3');
        new_item_title_element.textContent = iteminfo[flag].name;
        new_item_title_element.id = 'item_title'+String(flag);
        new_item_title_element.style.fontWeight = "bold";
        new_item_title_element.className = "mt-2";

        //単価
        new_div_price_element = document.createElement('div'); //単価のdiv
        new_div_price_element.className = 'input-group input-group-lg m-1';
        new_div_price_element.id = 'div_price'+String(flag);
        new_label_price_element = document.createElement('label');
        new_label_price_element.textContent = '単価';
        new_label_price_element.className = "input-group-text";
        new_item_price_element = document.createElement('input');
        new_item_price_element.className = 'form-control';
        new_item_price_element.type = 'number';
        new_item_price_element.ariaLabel = "Readonly input example";
        new_item_price_element.disabled = true;
        new_item_price_element.style.width = "20%";
        new_item_price_element.value = iteminfo[flag].price;
        new_div_price_element.appendChild(new_label_price_element); //専用のdivに突っ込む
        new_div_price_element.appendChild(new_item_price_element); //こちらも同様。

        //数量
        new_div_quantity_element = document.createElement('div'); //数量のdiv
        new_div_quantity_element.className = 'input-group input-group-lg m-1';
        new_div_quantity_element.id = 'div_quantity'+String(flag);
        new_label_quantity_element = document.createElement('span');
        new_label_quantity_element.textContent = '数量';
        new_label_quantity_element.className = "input-group-text"
        new_item_quantity_element = document.createElement('input');
        new_item_quantity_element.className = 'form-control';
        new_item_quantity_element.id = 'item_quantity'+String(flag);
        new_item_quantity_element.type = 'number';
        new_item_quantity_element.value = '0';
        new_item_quantity_element.min = '0'; //なんでかわからんけど、最小値指定しても0未満を入力できてしまう。うんち
        new_div_quantity_element.appendChild(new_label_quantity_element);
        new_div_quantity_element.appendChild(new_item_quantity_element);
        
        //小計
        new_div_subtotal_element = document.createElement('div'); //小計のdiv
        new_div_subtotal_element.className = 'input-group input-group-lg m-1';
        new_div_subtotal_element.id = 'div_subtotal'+String(flag);
        new_label_subtotal_element = document.createElement('label');
        new_label_subtotal_element.textContent = '小計';
        new_label_subtotal_element.id = 'label_subtotal'+String(flag);
        new_label_subtotal_element.className = "input-group-text";
        new_item_subtotal_element = document.createElement('input');
        new_item_subtotal_element.id = 'subtotal'+String(flag);
        new_item_subtotal_element.className = 'form-control';
        new_item_subtotal_element.disabled = true;
        new_item_subtotal_element.ariaLabel = "Readonly";
        new_item_subtotal_element.type = 'number';
        new_item_subtotal_element.placeholder = '0';
        new_item_subtotal_element.style.width = "20%";
        new_div_subtotal_element.appendChild(new_label_subtotal_element);
        new_div_subtotal_element.appendChild(new_item_subtotal_element);

        //商品名ごとのdiv
        new_div_element = document.createElement('div');
        new_div_element.className = 'd-flex';
        new_div_element.id = 'main_div'+String(flag);
        new_div_element.appendChild(new_div_price_element);
        new_div_element.appendChild(new_div_quantity_element);
        new_div_element.appendChild(new_div_subtotal_element);

        if (flag == 0){
          //site_titleの後ろにぶち込む
          prev_element = document.getElementById('site_title');
          prev_element.after(new_item_title_element);
          prev_element = document.getElementById('item_title'+String(flag));
          //商品名ごとのdivをぶち込む
          prev_element.after(new_div_element);

          //div1にdiv2をぶち込む(実際は単価のinput要素の直後にぶち込む)
          //subtotal_position = document.getElementById(new_label_subtotal_element.id);
          //subtotal_position.parentNode.insertBefore(new_div_element2,subtotal_position);
          
        }else{
          prev_element = document.getElementById('main_div'+String(flag - 1));
          prev_element.after(new_item_title_element);
          prev_element = document.getElementById('item_title'+String(flag));
          //商品名ごとのdivをぶち込む
          prev_element.after(new_div_element);

          //div1にdiv2をぶち込む
          //subtotal_position = document.getElementById(new_label_subtotal_element.id);
          //subtotal_position.parentNode.insertBefore(new_div_element2,subtotal_position);
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
        document.getElementById('deposit').value = "0";
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
        deposit_element.value = '0';
        new_div_element4 = document.createElement('div');
        new_div_element4.className = 'input-group input-group-lg m-1';
        new_div_element4.id = 'div4';
        new_div_element4.appendChild(deposit_element_label);
        new_div_element4.appendChild(deposit_element);
        new_div_element4.style.width = "50%";
        document.getElementById('money_number_div').after(new_div_element3);
        document.getElementById('deposit_div').appendChild(new_div_element4);

        //お預かり金額のマウスホイールによる変更
        deposit_element.addEventListener('wheel',(e) => {
          e.preventDefault();
          if(e.deltaY > 0){
            if(Number(document.getElementById(e.target.id).value) == 0){
              document.getElementById(e.target.id).value = '0'; //0未満にならないように。ホイールで数値を設定するとき限定の機能。(暫定)
            }else{
              document.getElementById(e.target.id).value = String(Number(document.getElementById(e.target.id).value) - 10);
            }
          }else{
            document.getElementById(e.target.id).value = String(Number(document.getElementById(e.target.id).value) + 10);
          }
          //confirm_total();
        });
      }
    }

    if(is_placed == false){
      for(flag=0;flag<iteminfo.length;flag++){
        //数量のマウスホイールによる変更
        document.getElementById('item_quantity'+String(flag)).addEventListener('wheel',(e) => {
          e.preventDefault();
          if(e.deltaY > 0){
            if(Number(document.getElementById(e.target.id).value) == 0){
              document.getElementById(e.target.id).value = '0'; //0未満にならないように。ホイールで数値を設定するとき限定の機能。(暫定)
            }else{
              document.getElementById(e.target.id).value = String(Number(document.getElementById(e.target.id).value) - 1);
            }
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
    $button[0].textContent = '1 金額を提示する';
    $button[1].textContent = '2 おつりを表示(お預かり金額を入力してから押す)';
    $button[2].textContent = '3 会計を記録する';
    $button[3].textContent = '4 次の会計へ進む(画面をリセット)';
    $button[4].textContent = 'お客様画面を開く';

    var subtotal_num = 0;

    if(init_count == 0){
      $button[0].addEventListener('click',(e) => {
        confirm_total(be_given=false,phase=1);
        send_data(no_write=true,be_given=false);
        sound_1 = new Audio('static/voices/confirm_number.mp3');
        sound_1.play();
        sound_1.addEventListener('ended',function(){
          sound_2 = new Audio('static/voices/attention.mp3');
          sound_2.play();
        });
      });
      $button[1].addEventListener('click',(e) => {
        confirm_total(be_given=true,phase=2);
        send_data(no_write=true,be_given=true);
      });
      $button[2].addEventListener('click',(e) => {
        //confirm_total(be_given=false,phase=3);
        //ここに決済関数を
        send_data(no_write=false,be_given=true);
        sound_3 = new Audio('static/voices/thanks.mp3');
        sound_3.play();
        
      });
      $button[3].addEventListener('click',(e) => {
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
      $button[4].addEventListener('click',(e) => {
        window.open('http://localhost:8000/display','_blank');
      });
    }

    init_count +=1;
  };
  
  var is_confirmed = false;
  //会計(入力を反映)
  const confirm_total = (be_given,phase) => {
    if(phase == 1){
      total_price.value = '0 円';
      for(flag = 0;flag<iteminfo.length;flag++){
        //小計・合計金額を反映
        subtotal = document.getElementById('subtotal'+String(flag));
        item_quantity = document.getElementById('item_quantity'+String(flag)).value;
        subtotal_num = Number(iteminfo[flag].price) * Number(item_quantity);
        subtotal.placeholder = formatNumberWithComma(subtotal_num);
        subtotal.textContent = subtotal.placeholder;
        n += subtotal_num;
      }
      total_price.textContent = formatNumberWithComma(n) + " 円";
      console.log(typeof(formatNumberWithComma(n)))
    }

    //is_confirmed = true;
    if(phase == 2){
      console.log("フェーズ2");
      console.log("合計: "+String(n));
      console.log("おあずかり: "+document.getElementById('deposit').value);
      console.log("おつり: "+String(Number(document.getElementById('deposit').value) - n));
      console.log(formatNumberWithComma(Number(document.getElementById('deposit').value) - n))
      m = Number(document.getElementById('deposit').value) - n;
      change_price.textContent = formatNumberWithComma(Number(document.getElementById('deposit').value) - n) + " 円";
    }
  };

  //CSVに記録(PythonのHTTP鯖にPOST)
  const send_data =(no_write,be_given) => {
    //現在の入力状況を辞書型に格納
    var origin_data = [];
    var tupple = {};
    var deposit_change = {};
    for (flag = 0;flag<iteminfo.length;flag++){
      tupple = {
        name: iteminfo[flag].name,
        amount: String(document.getElementById('item_quantity'+String(flag)).value),
        subtotal: String(Number(iteminfo[flag].price) * Number(document.getElementById('item_quantity'+String(flag)).value))
      };
      origin_data.push(tupple);
    }

    console.log(document.getElementById('deposit').value)
    deposit_change = {
      deposit: String(document.getElementById('deposit').value),
      be_given: String(be_given)
    };
    origin_data.push(deposit_change);

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