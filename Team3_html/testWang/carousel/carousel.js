window.addEventListener('load', bind)
function bind(){ 
const track = document.querySelector('.track')
const slides = document.querySelectorAll('.slide')

const prev = document.querySelector('.prev')
const next = document.querySelector('.next')

const dots = document.querySelectorAll('.dot')

let index = 0
const width = 300

function indicator(){

  dots.forEach(function(dot){
    dot.classList.remove('active')
  })

  dots[index].classList.add('active')

}

function move(){

  index++

  track.style.transition = "0.5s"
  track.style.transform = "translateX(-" + (width * index) + "px)"

  if(index === slides.length - 1){

    setTimeout(function(){

      track.style.transition = "none"
      track.style.transform = "translateX(0px)"
      index = 0
      indicator()

    },500)

  }else{

    indicator()

  }

}

let auto = setInterval(move,2000)

next.addEventListener('click',function(){

  move()

})

prev.addEventListener('click',function(){

  if(index === 0){

    index = slides.length - 2
    track.style.transition = "none"
    track.style.transform = "translateX(-" + (width * index) + "px)"

  }

  index--

  track.style.transition = "0.5s"
  track.style.transform = "translateX(-" + (width * index) + "px)"

  indicator()

})
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
