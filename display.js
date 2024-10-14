//商品情報の定義
//未来の俺、まあ自動取得できるようにやっといてくれ
var iteminfo = [
    {
      name: 'キーホルダー大',
      price: '300',
    },
    {
      name: 'キーホルダー小',
      price: '200',
    },
    {
      name: 'オリジナルカップ',
      price: '500',
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
  
  //色々要素
  var init_count = 0;
  var is_placed = false;
  var new_item_title_element = null;
  var new_item_price_element = null;
  var new_item_subtotal_element = null;
  var new_label_price_element = null;
  var new_label_quantity_element = null;
  const new_br_element = document.createElement('br');

  var prev_element = null;
  var subtotal_position = null;

  const init = () => {
    for(flag = 0;flag<iteminfo.length;flag++){
      if(init_count == 0){
        //商品名
        new_item_title_element = document.createElement('h3');
        new_item_title_element.textContent = iteminfo[flag].name+" ("+iteminfo[flag].price+"円)";
        new_item_title_element.id = 'item_title'+String(flag);
        new_item_title_element.style.fontWeight = 'bold';
        new_item_title_element.className = 'mt-2';

        //数量
        new_label_quantity_element = document.createElement('span');
        new_label_quantity_element.textContent = '数量';
        new_label_quantity_element.className = 'input-group-text';
        new_item_quantity_element = document.createElement('input');
        new_item_quantity_element.className = 'form-control';
        new_item_quantity_element.id = 'item_quantity'+String(flag);
        new_item_quantity_element.type = 'text';
        new_item_quantity_element.value = '0';
        new_item_quantity_element.ariaLabel = 'readonly input example'

        //小計
        new_label_subtotal_element = document.createElement('span');
        new_label_subtotal_element.textContent = '小計';
        new_label_subtotal_element.className = 'input-group-text';
        new_label_subtotal_element.id = 'label_subtotal'+String(flag);
        new_item_subtotal_element = document.createElement('input');
        new_item_subtotal_element.id = 'subtotal'+String(flag);
        new_item_subtotal_element.className = 'form-control';
        new_item_subtotal_element.ariaLabel = 'readonly input example';
        new_item_subtotal_element.type = 'text';
        new_item_subtotal_element.value = '0';
        new_item_subtotal_element.style.width = '20%';

        //divその2
        new_div_element2 = document.createElement('div');
        new_div_element2.className = 'input-group input-group-lg m-1';
        new_div_element2.id = 'div2'+String(flag);
        new_div_element2.appendChild(new_label_quantity_element);
        new_div_element2.appendChild(new_item_quantity_element);
        new_div_element2.style.width = '20%';

        //divその2-1
        new_div_element2_1 = document.createElement('div');
        new_div_element2_1.className = 'input-group input-group-lg m-1';
        new_div_element2_1.id = 'div2_1'+String(flag);
        new_div_element2_1.appendChild(new_label_subtotal_element);
        new_div_element2_1.appendChild(new_item_subtotal_element);
        new_div_element2_1.style.width = '20%';

        //divその1
        new_div_element = document.createElement('div');
        new_div_element.className = 'd-flex input-group input-group-lg m-1';
        new_div_element.id = 'main_div'+String(flag);
        new_div_element.appendChild(new_br_element);
        new_div_element.appendChild(new_br_element);
        new_div_element.appendChild(new_div_element2);
        new_div_element.appendChild(new_div_element2_1);
        //new_div_element.appendChild(new_item_subtotal_element);

        if (flag == 0){
          //site_titleの後ろにぶち込む
          prev_element = document.getElementById('site_title');
          prev_element.after(new_item_title_element);
          prev_element = document.getElementById('item_title'+String(flag));
          //div1をぶち込む
          prev_element.after(new_div_element);

          //div1にdiv2をぶち込む(実際は単価のinput要素の直後にぶち込む)
          //subtotal_position = document.getElementById(new_label_subtotal_element.id);
          //subtotal_position.parentNode.insertBefore(new_div_element2_1,subtotal_position);
          
        }else{
          prev_element = document.getElementById('main_div'+String(flag - 1));
          prev_element.after(new_item_title_element);
          prev_element = document.getElementById('item_title'+String(flag));
          //div1をぶち込む
          prev_element.after(new_div_element);

          //div1にdiv2をぶち込む
          //subtotal_position = document.getElementById(new_label_subtotal_element.id);
          //subtotal_position.parentNode.insertBefore(new_div_element2,subtotal_position);
        }
      }else{
        document.getElementById('item_quantity'+String(flag)).value = '0';
        document.getElementById('subtotal'+String(flag)).placeholder = '0';
        document.getElementById('total').textContent = '0 円';
      }

      is_placed = true;
    }

    //最後に改行を入れる
    const last_element = document.getElementById(new_div_element.id);
    if(is_placed == false){
      last_element.insertAdjacentHTML('afterend','<br><br>');
    }

    //合計金額
    total_price = document.getElementById('total');
    total_price.textContent = '0 円';

    //おあずかり金額
    const deposit = document.getElementById('deposit');
    deposit.textContent = '0 円';

    //おつり
    const change = document.getElementById('change');
    change.textContent = '0 円';

  };

  const connection = io.connect();
  var total = 0;
  var n = 0;

  const formatNumberWithComma = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  connection.on('connect', () => {
    console.log('connected');
  });
  connection.on('disconnect', () => {
    console.log('disconnected');
  });
  var be_given = null;
  connection.on('message', (data) => {
    item_data = data['data'];
    total = 0;
    console.log("受け取った！")

    if(item_data[0]['name'] == 'all_zero'){
      location.reload(); //再読み込みでページリセット
    }else{
      for(i=0;i<item_data.length-1;i++){
        
        document.getElementById('item_quantity'+String(i)).value = item_data[i]['amount'];
        document.getElementById('subtotal'+String(i)).value = String(formatNumberWithComma(Number(item_data[i]['amount']) * Number(iteminfo[i]['price'])));
        //console.log(String(Number(item_data[i]['amount']) * Number(iteminfo[i]['price'])))
        total += Number(item_data[i]['subtotal']);
        document.getElementById('total').textContent = formatNumberWithComma(total) + ' 円';
        
      }
      console.log(item_data[item_data.length -1]);
      //お預かりとおつり
      if(item_data[item_data.length -1]['be_given'] == 'true'){
        document.getElementById('deposit').textContent = formatNumberWithComma(Number(item_data[item_data.length -1]['deposit'])) + ' 円';
        change_number = Number(item_data[item_data.length -1]['deposit']) - total;
        document.getElementById('change').textContent = formatNumberWithComma(change_number) + ' 円';
      }
    }});

  init();