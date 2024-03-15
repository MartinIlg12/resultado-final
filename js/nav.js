(function(){
    const openButton = document.querySelector('.nav__nav');
    const nav = document.querySelector('.nav__link');
    const closeNav = document.querySelector('.nav__close');

    openButton.addEventListener('click', ()=>{
        nav.classList.add('nav__link--show');
    });

    closeNav.addEventListener('click', ()=>{
        nav.classList.remove('nav__link--show');
    });

    


})();