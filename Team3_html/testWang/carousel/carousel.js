window.addEventListener('load', bind)
function bind(){ 
const slider = document.querySelector('.slider');
const items = document.querySelectorAll('.item');

let index = 0;
const total = items.length;

setInterval(() => {

  index++;

  // 마지막 다음이면 처음으로
  if (index >= total) {
    index = 0;
  }

  slider.style.transform = `translateX(-${index * 100}%)`;

}, 2000);
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
