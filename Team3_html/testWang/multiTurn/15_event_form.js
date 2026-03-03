window.addEventListener('load',function(){
    
    const log = document.querySelector('#log')

    window.addEventListener('resize', function(evt){
        const w = window.innerWidth;
        const h = window.innerHeight;

        log.innerHTML = `<br>너비:${w}, 높이${h}` +log.innerHTML;
    })

    const id = this.document.querySelector('#id')
    
    id.addEventListener('focus', function(evt){
        id.style.backgroundColor = 'yellow'
    })
    id.addEventListener('blur', function(evt){
        id.style.backgroundColor = ''
    })
    // input text등이 변경될 때 마다
    id.addEventListener('input', function(evt){
        const r = parseInt(Math.random()* 256)
        const g = parseInt(Math.random()* 256)
        const b = parseInt(Math.random()* 256)
        const a = Math.random()
        

        id.style.backgroundColor = `rgba(${r},${g},${b},${a})`
    })
    
    const form = document.querySelector('#form')
    const site = document.querySelector('#site')
    site.addEventListener('change', function(){
        console.log(site.value)
        

        if(site.value == 1){
            form.setAttribute('action', "https://search.naver.com/search.naver") 
        }else if(site.value == 2){
            form.setAttribute('action', 'https://www.google.com/search')
        }
    })

    form.addEventListener('submit', function(event){
        
        //html 태그의 고유(기본) 기능을 막아준다
        // 여기서는 submit의 기능을 막음
        event.preventDefault()
        // 검색어가 두 글자 이하면 alert
        const id = document.querySelector('#id')
        
        if(id.value.length <= 2){
            alert('검색어는 두글자 이상입니다')
        } else {
            form.submit()
        }
    })
    addEventListener('copy', function(event){
        event.preventDefault()
        this.alert('복사금지')
    })
        addEventListener('selectstart', function(event){
            event.preventDefault()
    })

    this.document.querySelector('#parent').addEventListener('click', function(event){
        console.log('부모 click') //,true 
        // event.target : 실제 이벤트가 발생한 DOM
        console.log('event.target : ' , event.target)
        // event.currentTarget : 이벤트가 적용되어있는 DOM
        console.log('event.currentTarget :', event.currentTarget)
        console.log('this :', this)
        console.log(' event.currentTarget:', this ===  event.currentTarget)
        // arrow function인 경우 this를 변경하지 않음
        // this === window
    })

    this.document.querySelector('#child1').addEventListener('click', function(event){
        // 전파 방지
        // 부모로 전달되는 이벤트 중지
        // event.stopPropagation()

        console.log('자식1 click')
    })


    // table 태그에 click 이벤트 주기
    // click된 dom 출력
    // DOM.classList.contains('chk')로
    // checkbox일 경우만 value 출력
    // this.document.querySelector('#board').addEventListener('click', function(evt){ 
    //     if(evt.target.classList.contains('chk')){
    //          console.log(evt.target.value)
    //     }
       
    //     // 5.제목을 클릭했을 때만 내용이 나오도록 출력
    //     if(evt.target.classList.contains('title')){
    //         console.log(evt.target.textContent)
    //     }
    // })

    // 6. 이제 table에 위임하지 않고
    // tr에 위임하게 해주세요
    // '#board tr'
    const trs = document.querySelectorAll('#board tr')
    for(i of trs){
        i. addEventListener('click', function(evt){
        // 7. 무조건 제목의 내용이 출력되게
            console.log(evt.currentTarget.querySelector('.title').textContent)
        // if(!(evt.target.classList.contains('chk'))){
            // console.log(evt.currentTarget.querySelector('.title').textContent)
        // }
        // // 8. check 박스를 눌렀을 때만 제목이 안나오게

        })

        i.querySelector('input.chk').addEventListener('click',function(evt){
            evt.stopPropagation()
            // parent로 가는 방법
            console.log(this.parentNode.parentNode.querySelector('.title').textContent)
            

        })
     
    }
    
    
        
    document.querySelector('#login').addEventListener('click', function(evt){
        document.querySelector('#log2').style.color = 'red'
       
            if(!(document.querySelector('#id2').value)){
                document.querySelector('#log2').innerText = '아이디 또는 전화번호를를 입력해주세요'
            }
            if(!(document.querySelector('#pw2').value)){
                document.querySelector('#log2').innerText = '비밀번호를 입력해주세요'
            }
            if((document.querySelector('#id2').value) && (document.querySelector('#pw2').value)){
                document.querySelector('#log2').innerHTML = ''
            }
    })
    


    // 문제 4번
    // 클릭 발생시 굵어져야함
    // 다음 클릭 발생시 이전 것은 원상복귀하고 클릭한 것이 굵어져야함
    // 초기화 때리고 하면 됨.
    // const list = this.document.querySelectorAll('ul li')
    // for(let i of list){
    //     i.addEventListener('click', function(evt){
    //         for(c of list){
    //             if(!(c.innerText == i.innerText)){
    //                 c.style.fontWeight = '400'
    //                 console.log('c',c)
    //                 console.log(c.innerText)
    //                 console.log(i.innerText)
    //             }
    //         }
    //         evt.target.style.fontWeight = '900'
    //     })
    // }
    const ul = document.querySelector('ul');
    const list = ul.getElementsByTagName('li');

    ul.addEventListener('click', function(evt) {
        // 1. 클릭된 요소가 LI인지 확인
        if (evt.target.tagName === 'LI') {
            
            // 2. 모든 li 안의 strong 태그를 제거하고 일반 텍스트로 되돌림
            for (let item of list) {
                // 이미 strong이 있다면 그 안의 글자만 꺼내서 다시 넣음
                // (innerText를 대입하면 모든 HTML 태그가 사라지고 텍스트만 남습니다)
                item.innerHTML = item.innerText;
            }

            // 3. 클릭된 요소의 내용물을 strong 태그로 감싸기
            const originalText = evt.target.innerText;
            evt.target.innerHTML = `<strong>${originalText}</strong>`;
        }
    });

    // 문제 2
    let order_menu = ""
    let total = 0
    let size =this.document.querySelectorAll('[name="size"]')
    let dou =this.document.querySelectorAll('[name="dou"]')
    let topping=  this.document.querySelectorAll('[name="topping"]')
    
    this.document.querySelector('#total').addEventListener('click',function(){
        if(document.querySelector('#pizza option:checked')){
            order_menu += document.querySelector('#pizza option:checked').textContent + ' '
        }
                
 
        for(let i of size){
            if(i.checked){
                total +=  Number(i.getAttribute('value'))
                order_menu += i.classList[0] + ' '
            }
        }
        for(let i of dou){
            if(i.checked){
                total +=  Number(i.getAttribute('value'))
                order_menu += i.classList[0] + ' '
            }
        }
        for(let i of topping){
            if(i.checked){
                total +=  Number(i.getAttribute('value'))
                order_menu += i.classList[0] + ' '
            }
        }

        console.log(total)
        console.log(order_menu)
        total = 0
        order_menu = ""
 
    })

    // 문제5
    let url  =  "http://www.foodnmed.com/news/photo/201903/18296_3834_4319.jpg"
    const aa =this.document.querySelector('#cat1')    
    this.document.querySelector('#cat1').addEventListener('mouseenter',function(evt){
        let sr = document.createElement('img')
        sr.src = url
        sr.classList.add('cat2')
        aa.after(sr)
    })
    this.document.querySelector('#cat1').addEventListener('mouseout',function(evt){
        document.querySelector('.cat2').remove()
    })

    
    // 문제 6
    // 할 일을 적는 input, 
    // 6-1 추가 버튼을 누르면
    //      체크박스와 할일
    document.querySelector('.parent').addEventListener('click', function(evt){ 
        if(evt.target.id === "bt"){
            // 상자
            const divfirst = document.createElement('div')
            divfirst.setAttribute('class', 'first')
            this.querySelector('#bt').after(divfirst)
            const a = this.querySelector('#todo').value
            // 삭제 버튼
            const del = document.createElement('button')
            del.setAttribute('class', 'del')
            del.innerText = '삭제'
            divfirst.prepend(del)
            // 추가된 할일
            const div2 = document.createElement('div')
            div2.setAttribute('class', 'todo')
            div2.innerText = a
            divfirst.prepend(div2)
            // 체크박스
            const xs = document.createElement('input')
            xs.setAttribute('type',"checkbox")
            xs.setAttribute('class',"check")
            divfirst.prepend(xs)
            // <br>
            const br = document.createElement('br')
            divfirst.append(br)
        }
        // 6-2
        if(evt.target.classList.contains('del')){
            evt.target.parentNode.remove()
            
        }
        // 문제 6-3
        // if (evt.target.classList.contains('all')) {
        //     const xs = document.querySelectorAll('.check')
        //     for (let i of xs) {
        //         i.checked = evt.target.checked
        //     }
        // }
        // if (evt.target.classList.contains('check')) {

        // const allCheck = this.querySelector('.all')
        // const checks = this.querySelectorAll('.check')

        // let allChecked = true

        // for (let c of checks) {
        //     if (!c.checked) {
        //         allChecked = false
        //         break
        //     }
        // }

        // allCheck.checked = allChecked
        // }

        // if(evt.target.classList.contains('all')){
        //     console.log('111')
        //     if(document.querySelector('.all:checked')){
        //         const xs = document.querySelectorAll('.check')
        //         for(let i of xs){
        //             console.log(i)
        //             i.checked =true
        //         } 
        //     } else{
        //         const xs = document.querySelectorAll('.check')
        //         for(let i of xs){
        //             console.log(i)
        //             i.checked =false
        //         } 

        //     }
        // }
       
        // 문제 6-4
        if(evt.target.classList.contains('check')){
            const a = document.querySelector('.all')
            for(i of document.querySelectorAll('.check')){
                if(!(i.checked)){
                    a.checked = false
                    break 
                } else {
                    a.checked = true
                }
            }
            
        }
        //문제 6-5
        if(evt.target.classList.contains('delete')){
            for(i of document.querySelectorAll('.check')){
                if(i.checked){
                    i.parentNode.remove()
                    
                } 
            }
            
        }

        if(evt.target.id ==='all'){
            console.log('힘내자')
        }


    })

    // 6-2 개별 삭제 버튼이 있고
    //      삭제 버튼 클릭 시 그 줄이 지워진다


    // 6-3 전체 선택 checkbox가 있고
    //      전체 선택 체크 시 모든 checkbox 체크
    //      전체 선택 체크 해제 시 모든 checkbox 체크 해제


    // 6-4 전체 선택 후 하나라도 해제되면 전체 선택도 해제
    //      모든 항목이 체크 되어있다면 전체 선택도 체크
    // 6-5 선택 삭제 버튼 클릭 시 선택된 내용만 삭제
    document.querySelector('.parent').addEventListener('change', function(evt){

    // 전체 선택
    if (evt.target.classList.contains('all')) {
            const checks = this.querySelectorAll('.check')
            for (let c of checks) {
                c.checked = evt.target.checked
            }
        }

    // 개별 체크
    if (evt.target.classList.contains('check')) {
            const allCheck = this.querySelector('.all')
            const checks = this.querySelectorAll('.check')
            allCheck.checked = [...checks].every(c => c.checked)
        }

    })


})
    




console.log('밖에서 this:', this)
console.log('밖에서 window:', this === window )