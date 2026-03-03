window.addEventListener('load', bind)
function bind(){
    const name = document.querySelector("#userName")


    document.querySelector("#paid-btn").addEventListener('click', function(){

        //현재 점검 해야하는 거
        //confirm으로 결제 못하게 막을 예정
        //예약자 이름
        // 연락처
        // 이메일
        // 카드번호
        // 유효기간 cvc
        // 약관 동의 필수에서만
        
        name.value = "게코다제"
        

    })



}