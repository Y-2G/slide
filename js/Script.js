/* ref
https://qiita.com/kouh/items/dfc14d25ccb4e50afe89
*/

// 各DOM要素を取得する
let nowSlide = document.getElementById('nowSlide');
let prevSlide = document.getElementById('prevSlide');
let nextSlide = document.getElementById('nextSlide');
  
let slides = document.getElementsByClassName('slides');
let slideSet = document.getElementsByClassName('slideSet');

let next = document.getElementById('next');
let prev = document.getElementById('prev');

// スライドの表示順序を取得する
function GetIndexs(){

  let nowSlideIndex  = 0;
  let prevSlideIndex = 0;
  let nextSlideIndex = 0;

  for(let i = 0; i < slides.length; i++){
    if(slides[i].className == "slides active"){
      nowSlideIndex = i;
    }
  }

  prevSlideIndex = nowSlideIndex - 1;
  nextSlideIndex = nowSlideIndex + 1;

  // 最初のスライドを表示してたら最後をprevにする
  if(nowSlideIndex == 0){
    prevSlideIndex = slides.length -1;
  }

  // 最後のスライドを表示していたら最初をnextにする
  if(nowSlideIndex == slides.length - 1){
    nextSlideIndex = 0;
  }

  let indexArray = {};
  indexArray.now = nowSlideIndex;
  indexArray.prev = prevSlideIndex;
  indexArray.next = nextSlideIndex;
  
  return indexArray;
}

// スライドの画像をセットする
function SetSlides(){

  // スライドのインデックスを取得
  index = GetIndexs();

  // スライドの準備をする
  let now  = slides[index.now].firstElementChild.cloneNode(true);
  let prev = slides[index.prev].firstElementChild.cloneNode(true);
  let next = slides[index.next].firstElementChild.cloneNode(true);

  nowSlide.removeChild(nowSlide.firstElementChild);
  prevSlide.removeChild(prevSlide.firstElementChild);
  nextSlide.removeChild(nextSlide.firstElementChild);

  // スライドを表示エリアにセットする
  nowSlide.appendChild(now);
  prevSlide.appendChild(prev);
  nextSlide.appendChild(next);
}

// スライドを再度リセット
function ResetSlide(){
  // スライドのインデックスを取得
  index = GetIndexs();

  // 表示するスライドのクラスを変更する
  slides[index.now].className = "slides";
  slides[index.next].className = "slides active";

  SetSlides();
}

// setInterval用の変数定義
let test = new Array();
let AutoSlide = null;

// 次の画像をスライドする
function MoveNext(){
  test.push(setInterval(function(){
    MoveSlide(-1);
  }, 1));
}

// 自動でスライドする
function AutoMove(){
  test.push(setInterval(function(){
    MoveSlide(-1);
  }, 1));
}

// 画像を移動させる
let x = 0;
function MoveSlide(dist){
  // 指定位置まで移動したら止める
  if(Math.abs(x) >= 300){
    x = 0;
    clearInterval(test.shift());
    ResetSlide();
    return;
  }
  // 要素を移動する
  x = x + dist;
  let newx =  x + "px";
  nextSlide.firstElementChild.style.left = newx;
}

// 自動スライドのプリセット
function PresetAutoMove(){
  SetSlides();
  AutoSlide = setInterval(function(){
    AutoMove();
  }, 5000);
}

// nextボタンクリック
next.onclick = function(){
  clearInterval(test.shift());
  MoveNext();
}

// 画面ロード時に自動スライドをセット
window.onload = function(){
  PresetAutoMove();
}

// 画面から離れた時に自動スライドを切っておく
window.onblur = function(){
  clearInterval(AutoSlide);
}

// 画面に戻った時に自動スライドを再度セット
window.onfocus = function(){
  PresetAutoMove();
}

