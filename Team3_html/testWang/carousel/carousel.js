window.addEventListener('load', bind)
function bind(){ 
const track = document.querySelector('.track')
const slides = document.querySelectorAll('.slide')

const prev = document.querySelector('.prev')
const next = document.querySelector('.next')

const dots = document.querySelectorAll('.dot')

let index = 1;
const width = 300;
track.style.transform = `translateX(-${width * index}px)`;

function indicator() {
    dots.forEach(dot => dot.classList.remove('active'));
    
    let dotIndex = index - 1;
    if (index === 0) dotIndex = dots.length - 1; // 가짜 3번에 있을 땐 마지막 점
    if (index === slides.length - 1) dotIndex = 0; // 가짜 1번에 있을 땐 첫 번째 점
    
    if (dots[dotIndex]) {
        dots[dotIndex].classList.add('active');
    }
}

function move(){

  index++;

  track.style.transition = "0.5s"
  track.style.transform = "translateX(-" + (width * index) + "px)"

  if (index === slides.length - 1) {
        setTimeout(function() {
            track.style.transition = "none";
            index = 1; // 진짜 1번으로 순간 이동
            track.style.transform = "translateX(-" + (width * index) + "px)";
        }, 500);
    }
  
    
    // 인디케이터 업데이트를 위해 인덱스 보정
    let dotIndex = index - 1;
    if (index === slides.length - 1) dotIndex = 0; // 마지막 가짜에선 1번 점 점등
    if (index === 0) dotIndex = dots.length - 1;   // 첫 가짜에선 3번 점 점등
    
    updateIndicator(dotIndex);

}

function updateIndicator(current) {
    dots.forEach(dot => dot.classList.remove('active'));
    
    
      dots[current].classList.add('active');
   
}

let auto = setInterval(move,2000)

next.addEventListener('click',function(){
  clearInterval(auto)
  move()
  auto = setInterval(move,2000)
})

prev.addEventListener('click', function() {
    clearInterval(auto);

    index--; // 일단 왼쪽으로 한 칸 이동
    track.style.transition = "0.5s";
    track.style.transform = `translateX(-${width * index}px)`;

    // 만약 이동한 곳이 0번(가짜 3번)이라면?
    if (index === 0) {
        setTimeout(function() {
            track.style.transition = "none"; // 애니메이션 끄고
            index = slides.length - 2; // 진짜 3번 위치로 인덱스 변경
            track.style.transform = `translateX(-${width * index}px)`; // 순간 이동
        }, 500);
    }

    indicator();
    auto = setInterval(move, 2000);
});


const indicatorBox = document.querySelector('.indicator')


indicatorBox.addEventListener('click', function(e) {
  let count = 0; // 몇 번째 점인지 세기 위한 변수
  
  for (const dot of dots) {
    if (e.target === dot) {
      clearInterval(auto)
      index = count + 1; // 가짜 슬라이드 보정
      
      
        setTimeout(function() {
            track.style.transition = "none";
             // 진짜 1번으로 순간 이동
            track.style.transform = "translateX(-" + (width * index) + "px)";
        }, 1);
    
  
    
    // 인디케이터 업데이트를 위해 인덱스 보정
    let dotIndex = index - 1;
    if (index === slides.length - 1) dotIndex = 0; // 마지막 가짜에선 1번 점 점등
    if (index === 0) dotIndex = dots.length - 1;   // 첫 가짜에선 3번 점 점등
    
    updateIndicator(dotIndex);
        auto = setInterval(move, 2000);
      break; // 찾았으니 나머지 반복은 안 해도 됨 (효율적)
    }
    count++; // 다음 점으로 넘어가기 전 번호 증가
  }
});




}














































//  // setTimeout(함수, 시간ms == 1/1000초)
//         // 지연 시간 뒤에 콜백함수를 실행 줌
//         setTimeout( no_name, 1000 * 2 )
//         setTimeout( 
//             no_name, 
//             1000 * 2 
//         )
        
//         setTimeout( 
//             function (){
//                 console.log('익명함수3')
//             }, 
//             3000 
//         )

//         let idx = setTimeout( 
//             function (){
//                 console.log('익명함수4')
//             }, 
//             1000 * 10 
//         )
//         console.log('idx : ', idx)
//         clearTimeout(idx) // setTimeout을 취소

//         // setTimeout에서
//         // callback함수에 전달인자 주는 방법
//         let yy = 10
//         setTimeout(
//             function(x, y){
//                 console.log(x, y)
//             },
//             1000, 'a', yy
//         )

//         // setInterval
//         // setInterval(콜백함수, 지연시간)
//         // 지연시간 이후 실행을 반복해준다
//         let idx2 = setInterval(
//             function(){
//                 console.log('setInterval 실행')
//             }, 
//             1000*2)

//         setTimeout(function(){
//             clearInterval(idx2) // setInterval 취소
//         }, 1000*5)

//         function fn(){
//             console.log('fn 실행')
//             return 1
//         }
//         let fn2 = fn;
//         let fn3 = fn();

//         function fn4(){
//             console.log('fn 실행')
//             return function(){
//                 console.log('return으로 함수 줌')
//             }
//         }

//         console.log(  console.log('setInterval 실행')   )
