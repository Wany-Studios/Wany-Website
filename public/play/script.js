    function menu_function(e)
    {
        let img = document.querySelector(".img-menu");
        let menu = document.querySelector(".open");
        document.querySelector(".menu").classList.toggle("open");
        if(!menu){
            img.setAttribute("src", "../assets/img/close.png");
        }else{
            img.setAttribute("src", "../assets/img/svg/header/menu.svg");
        }
    }

    