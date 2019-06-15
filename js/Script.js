/* ref
https://qiita.com/kouh/items/dfc14d25ccb4e50afe89
*/

// 各DOM要素を取得する
let ShowArea = document.getElementById('ShowArea');
  
let slides = document.getElementsByClassName('slides');
let slideSet = document.getElementsByClassName('slideSet');

let nextButton = document.getElementById('nextButton');
let prevButton = document.getElementById('prevButton');

function GetNewSlide(nextOrPrev){
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

  let nowSlide = slides[nowSlideIndex].firstElementChild.cloneNode(true);
  let prevSlide = slides[prevSlideIndex].firstElementChild.cloneNode(true);
  let nextSlide = slides[nextSlideIndex].firstElementChild.cloneNode(true);

  let newSlide;
  slides[nowSlideIndex].className = "slides";
  if(nextOrPrev == "next"){
    newSlide = nextSlide;
    newSlide.style.width = "300px";
    newSlide.style.height = "100%";
    newSlide.style.position = "absolute";
    newSlide.style.left = "300px";
    slides[nextSlideIndex].className = "slides active";
  }
  if(nextOrPrev == "prev"){
    newSlide = prevSlide;
    newSlide.style.width = "300px";
    newSlide.style.height = "100%";
    newSlide.style.position = "absolute";
    newSlide.style.left = "-300px";
    slides[prevSlideIndex].className = "slides active";
  }

  return newSlide;
}

function SetNewSlide(slideElement){
  // スライドを表示エリアにセットする
  ShowArea.appendChild(slideElement);
}

// 画像を移動させる
let x = 0;
function MoveSlide(dist, newSlide){
  // 指定位置まで移動したら止める
  if(Math.abs(x) >= 300){
    x = 0;
    clearInterval(test.shift());
    return;
  }

  // 要素を移動する
  let testx = newSlide.getBoundingClientRect().left;
  x = x + dist;
  newSlide.style.left = (testx + dist) + "px";
}

// setInterval用の変数定義
let test = new Array();
let AutoSlide = null;

function MoveNewSlide(nextOrPrev){
  if(test.length > 0){
    return;
  }

  newSlide = GetNewSlide(nextOrPrev);
  SetNewSlide(newSlide)

  let moveDist = 0;

  if(nextOrPrev == "next"){
    moveDist = -1;
  }

  if(nextOrPrev == "prev"){
    moveDist = 1;
  }

  test.push(setInterval(function(){
    MoveSlide(moveDist, newSlide);
  }, 1));
}

// 自動スライドのプリセット
function SetAutoMove(){
  AutoSlide = setInterval(function(){
    MoveNewSlide("next");
  }, 5000);
}

// nextボタンクリック
nextButton.onclick = function(){
  clearInterval(AutoSlide);
  MoveNewSlide("next");
  SetAutoMove();
}

// prevボタンクリック
prevButton.onclick = function(){
  clearInterval(AutoSlide);
  MoveNewSlide("prev");
  SetAutoMove();
}

// 画面ロード時に自動スライドをセット
window.onload = function(){
  SetAutoMove();
}

// 画面から離れた時に自動スライドを切っておく
window.onblur = function(){
  clearInterval(AutoSlide);
}

// 画面に戻った時に自動スライドを再度セット
window.onfocus = function(){
  SetAutoMove();
}
