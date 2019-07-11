import $ from 'jquery'

export default class Home {
  constructor() {
    console.log('home!!')
    $.ajax({ url: '/api/contact.php' }).then(data => {
      console.log(data)
    })
  }
}
let count = 0; //メモ帳の通し番号
let data_num = 0; //メモ帳固有の番号
let index = 0;
//let num;
let memo = [];
$(()=>{
  //サイドメニューの開閉
  $('.js-hum').on('click',()=>{
    if($('.js-slide').hasClass('is-open')){
      $('.js-slide,.js-hum').removeClass('is-open');
    }else {
      $('.js-slide,.js-hum').addClass('is-open');
    }
  });

  //新規作成
  $('.js-btn--new').on('click',()=>{
    $('.js-text').val("").removeAttr('readonly').attr('placeholder','テキストエリア');
    if(localStorage.getItem('num')){
      count = parseInt(localStorage.getItem('num'));
    }else{
      count = 0;
    }
    $('.js-list').prepend(`<li class="p-sideBar__memo js-memo" data-num="${count}"><p class="p-sideBar__title js-addTitle">新規作成</p><p class="p-sideBar__time js-addTime">更新日時</p></li>`);
    memo.push([count,'','','']);
    console.log(memo);
    data_num = count;
    count ++;
    localStorage.setItem('num',count);
  });

  //保存の処理
  $('.js-btn--save').on('click',()=>{
    const text = $('.js-text').val();
    // console.log(text);//メモの内容
    const title = text.substring(0,10)
    // console.log(title);//タイトル
    const time = getTime();//時間
    // console.log(time);
    console.log(data_num);
    for(let i =0;i<=memo.length;i++){
      if(memo[i][0]==data_num){
        memo[i][0]=data_num;
        memo[i][1]=title;
        memo[i][2]=time;
        memo[i][3]=text;
        //指定したlistのテキストを変える
        $('.js-addTitle').eq(index).text(memo[i][1]);
        $('.js-addTime').eq(index).text(memo[i][2]);
        break;
      }
    }
    const jsonData = JSON.stringify(memo);
    localStorage.setItem('memo',jsonData);
    console.log(memo);
    //console.log(memo[count][3]);
  })

  //削除の処理
  $('.js-btn--del').on('click',()=>{
    //サイドバーを削除する。
    console.log(`index=${index}`);
    $('.js-memo').eq(index).remove();
    //配列の中身を削除する。
    for(let i =0;i<memo.length;i++){
      if(memo[i][0]==data_num){
        memo.splice(i,1);
        const jsonData = JSON.stringify(memo);
        localStorage.setItem('memo',jsonData);
        break;
      }
    }
  });
  //サイドバー
  $('.js-list').on('click','li',(e)=>{
    e.preventDefault();
    $('.js-text').removeAttr('readonly');
    index = $(e.currentTarget).index();
    data_num =$(e.currentTarget).attr('data-num');
    console.log(`data_num=${data_num}`)
    for(let j = 0;j<memo.length;j++){
      if(memo[j][0]==data_num){
        $('.js-text').val(memo[j][3]);
        break;
      }
    }
    $('.js-slide').removeClass('is-open');
  });
  //ページが開いた時に実行される処理
  const openPage = ()=>{
    if(localStorage.getItem('num')){
      count = parseInt(localStorage.getItem('num'));
      memo = JSON.parse(localStorage.getItem('memo'));
      console.log(memo);
      for(let i=0;i<memo.length;i++){
        $('.js-list').prepend(`<li class="p-sideBar__memo js-memo" data-num="${memo[i][0]}"><p class="p-sideBar__title js-addTitle">${memo[i][1]}</p><p class="p-sideBar__time js-addTime">${memo[i][2]}</p></li>`);
      }
    }else{
      count = 0;
    }
  }
  //時間の取得をする
  const getTime = ()=>{
    const DD = new Date();
    const Year = DD.getFullYear();
    const Month = DD.getMonth() + 1;
    const Day = DD.getDate();
    const Hours = DD.getHours();
    const Min = DD.getMinutes();
    return `${Year}年${Month}月${Day}日${Hours}時${Min}分`
  }
  //検索する
  $('.js-search').on('click',()=>{
    if($('#search').val()===''){
      console.log('null');
    }else{
      const searchstr = $('#search').val();
      let counter = 0;
      $('.js-memo').remove();
      for(let i=0;i<memo.length;i++){
        if(memo[i][3].indexOf(searchstr) > -1) {
          console.log(i);
          $('.js-list').prepend(`<li class="p-sideBar__memo js-memo u-search--yellow" data-num="${memo[i][0]}"><p class="p-sideBar__title js-addTitle">${memo[i][1]}</p><p class="p-sideBar__time js-addTime">${memo[i][2]}</p></li>`);
          // $(".js-memo").eq(j).addClass('u-search--yellow');
          counter++;
        }
      }
      //結果の表示
      if(!counter){
        alert(`${searchstr}の検索結果はありませんでした。`);
      }else{
        alert(`${searchstr}が${counter}件ヒットしました。`)
      }
    }
  })
  //検索結果のリセット
  $('.js-reset').on('click',()=>{
    $('.js-memo').remove();
    openPage();
  })
  window.onload=openPage();
});
