window.addEventListener('load', bind)
function bind() {

    const whole = document.querySelector('.whole')
    const clean = document.querySelector('.clean')
    const loc = document.querySelector('.loc')
    const cheap = document.querySelector('.cheap')
    const kind = document.querySelector('.kind')
    const acco = document.querySelector('.acco')


    function setActive(target) {
        whole.classList.remove('chip--active');
        clean.classList.remove('chip--active');
        loc.classList.remove('chip--active');
        cheap.classList.remove('chip--active');
        kind.classList.remove('chip--active')
        acco.classList.remove('chip--active')

        target.classList.add('chip--active');
    }

    whole.addEventListener('click', () => {
        setActive(whole)
    })

    clean.addEventListener('click', () => {
        setActive(clean)
    })

    loc.addEventListener('click', () => {
        setActive(loc)
    })

    cheap.addEventListener('click', () => {
        setActive(cheap)
    })

    kind.addEventListener('click', () => {
        setActive(kind)
    })

    acco.addEventListener('click', () => {
        setActive(acco)
    })

    const like1 = document.querySelector('.like1')
    const PMH = document.querySelector('.PMH')
    const LYS = document.querySelector('.LYS')
    const KJS = document.querySelector('.KJS')
    const like2 = document.querySelector('.like2')
    const like3 = document.querySelector('.like3')

    like1.addEventListener('click', function () {
        PMH.textContent++
    })

    like2.addEventListener('click', () => {
        LYS.textContent++
    })

    like3.addEventListener('click', () => {
        KJS.textContent++
    })

    // a = {
    //     dom: querySelector,
    //     date: 
    // }

    document.addEventListener("DOMContentLoaded", () => {
        const modal = document.querySelector("[data-modal]");
        const openBtn = document.querySelector("[data-open-modal]");
        const closeBtns = document.querySelectorAll("[data-close-modal]");

        if (!modal || !openBtn) return;

        const open = () => {
            modal.hidden = false;
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        };

        const close = () => {
            modal.hidden = true;
            modal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        };

        openBtn.addEventListener("click", open);
        closeBtns.forEach(b => b.addEventListener("click", close));

        // ESC로 닫기
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !modal.hidden) close();
        });
    });
    // ===== 리뷰 작성 모달 열기/닫기 =====
    const modal = document.querySelector('[data-modal]');
    const openBtn = document.querySelector('[data-open-modal]');
    const closeBtns = document.querySelectorAll('[data-close-modal]');

    if (modal && openBtn) {
        const open = () => {
            modal.hidden = false;
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const close = () => {
            modal.hidden = true;
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        openBtn.addEventListener('click', open);
        closeBtns.forEach(btn => btn.addEventListener('click', close));

        // ESC로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.hidden) close();
        });
    }

    const btn_modal = document.querySelector('.btn-modal')

    btn_modal.addEventListener('click',()=>{
        alert('리뷰 저장기능은 준비중입니다')
    })

    const field__textarea_text = document.querySelector('.field__textarea_text')

    document.addEventListener("input", (e) => {
        const ta = e.target.closest(".field__textarea_text");
        if (!ta) return;
        const item = ta.closest(".field");
        const limitEl = item.querySelector(".reply-limit");
        const v = field__textarea_text.value.slice(0, 1000);
        if (v !== field__textarea_text.value) field__textarea_text.value = v;
        if (limitEl) limitEl.textContent = `${field__textarea_text.value.length} / 1000`;
    });

}