let c = document.getElementById("canvas");
let ctx = c.getContext("2d");


function resize() {
    let box = c.getBoundingClientRect();
    c.width = box.width;
    c.height = box.height;


}

let light = {
    x: 160,
    y: 200
}


// let colors = ["#f5c156", "#e6616b", "#5cd3ad"];
let colors = ["#ffffff", "#ffffff", "#ffffff"];

function drawLight() {
    ctx.beginPath();
    ctx.arc(light.x, light.y, 1000, 0, 2 * Math.PI);
    let gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, 1000);
    gradient.addColorStop(0, "#222222");
    gradient.addColorStop(1, "#000000");
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(light.x, light.y, 20, 0, 2 * Math.PI);
    gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, 5);
    gradient.addColorStop(0, "#fff");
    gradient.addColorStop(0, "#222222");
    ctx.fillStyle = gradient;
    ctx.fill();
}


function Box() {
    this.half_size = Math.floor((Math.random() * 50) + 1);
    this.x = Math.floor((Math.random() * c.width) + 1);
    this.y = Math.floor((Math.random() * c.height) + 1);
    this.r = Math.random() * Math.PI;
    this.shadow_length = 2000;
    this.color = colors[Math.floor((Math.random() * colors.length))];

    this.getDots = function() {

        let full = (Math.PI * 2) / 4;


        let p1 = {
            x: this.x + this.half_size * Math.sin(this.r),
            y: this.y + this.half_size * Math.cos(this.r)
        };
        let p2 = {
            x: this.x + this.half_size * Math.sin(this.r + full),
            y: this.y + this.half_size * Math.cos(this.r + full)
        };
        let p3 = {
            x: this.x + this.half_size * Math.sin(this.r + full * 2),
            y: this.y + this.half_size * Math.cos(this.r + full * 2)
        };
        let p4 = {
            x: this.x + this.half_size * Math.sin(this.r + full * 3),
            y: this.y + this.half_size * Math.cos(this.r + full * 3)
        };

        return {
            p1: p1,
            p2: p2,
            p3: p3,
            p4: p4
        };
    }
    this.rotate = function() {
        let speed = (60 - this.half_size) / 20;
        this.r += speed * 0.002;
        this.x += speed;
        this.y += speed;
    }
    this.draw = function() {
        let dots = this.getDots();
        ctx.beginPath();
        ctx.moveTo(dots.p1.x, dots.p1.y);
        ctx.lineTo(dots.p2.x, dots.p2.y);
        ctx.lineTo(dots.p3.x, dots.p3.y);
        ctx.lineTo(dots.p4.x, dots.p4.y);
        ctx.fillStyle = this.color;
        ctx.fill();


        if (this.y - this.half_size > c.height) {
            this.y -= c.height + 100;
        }
        if (this.x - this.half_size > c.width) {
            this.x -= c.width + 100;
        }
    }
    this.drawShadow = function() {
        let dots = this.getDots();
        let angles = [];
        let points = [];

        for (let dot in dots) {
            let angle = Math.atan2(light.y - dots[dot].y, light.x - dots[dot].x);
            let endX = dots[dot].x + this.shadow_length * Math.sin(-angle - Math.PI / 2);
            let endY = dots[dot].y + this.shadow_length * Math.cos(-angle - Math.PI / 2);
            angles.push(angle);
            points.push({
                endX: endX,
                endY: endY,
                startX: dots[dot].x,
                startY: dots[dot].y
            });
        }

        for (let i = points.length - 1; i >= 0; i--) {
            let n = i === 3 ? 0 : i + 1;
            ctx.beginPath();
            ctx.moveTo(points[i].startX, points[i].startY);
            ctx.lineTo(points[n].startX, points[n].startY);
            ctx.lineTo(points[n].endX, points[n].endY);
            ctx.lineTo(points[i].endX, points[i].endY);
            ctx.fillStyle = "#222222";
            ctx.fill();
        }
    }
}

let boxes = [];

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    drawLight();

    for (let i = 0; i < boxes.length; i++) {
        boxes[i].rotate();
        boxes[i].drawShadow();
    }
    for (let i = 0; i < boxes.length; i++) {
        collisionDetection(i)
        boxes[i].draw();
    }
    requestAnimationFrame(draw);
}


resize();
draw();


while (boxes.length < 14) {
    boxes.push(new Box());
}

window.onresize = resize;
c.onmousemove = function(e) {
    light.x = e.offsetX === undefined ? e.layerX : e.offsetX;
    light.y = e.offsetY === undefined ? e.layerY : e.offsetY;
}


function collisionDetection(b){
    for (let i = boxes.length - 1; i >= 0; i--) {
        if(i !== b){
            let dx = (boxes[b].x + boxes[b].half_size) - (boxes[i].x + boxes[i].half_size);
            let dy = (boxes[b].y + boxes[b].half_size) - (boxes[i].y + boxes[i].half_size);
            let d = Math.sqrt(dx * dx + dy * dy);
            if (d < boxes[b].half_size + boxes[i].half_size) {
                boxes[b].half_size = boxes[b].half_size > 1 ? boxes[b].half_size-=1 : 1;
                boxes[i].half_size = boxes[i].half_size > 1 ? boxes[i].half_size-=1 : 1;
            }
        }
    }
}

let block1 = document.querySelector('.block1');
let block2 = document.querySelector('.block2');
let block3 = document.querySelector('.block3');
let block4 = document.querySelector('.block4');
let blocks = [block1, block2, block3, block4];

let dots = document.getElementsByClassName("dot");
for (let i=0;i<dots.length;i++){
    dots[i].addEventListener("mouseover", ()=>{
        dots[i].classList.add("active")
    });
    dots[i].addEventListener("mouseout", ()=>{
        dots[i].classList.remove("active")
    });
    dots[i].addEventListener("click", ()=>{
        if (dots[i].classList.contains("active_click") && blocks[i].classList.contains("main_slider_block")){

        } else {
            for(let j=0;j<dots.length;j++){
                if (j!==i){
                    dots[j].classList.remove("active_click");
                    dots[i].classList.add("active_click");
                    blocks[j].classList.remove("active");
                    blocks[i].classList.add("active");
                }
            }


        }

    });

}

// //hover menu elements
//
// let menu_items = document.getElementsByClassName('menu-body__links');
// for (let i = 0; i < menu_items.length; i++){
//     menu_items[i].addEventListener('mouseover', function over(){
//         menu_items[i].classList.add("menu-body__links_active");
//     },true);
//     menu_items[i].addEventListener('mouseout', function out(){
//         menu_items[i].classList.remove("menu-body__links_active");
//     },true);
// }
//
// //hover menu elements------------------
//
// // scroll to anchors
//
// let header_menu_elements = document.querySelectorAll('.menu-body__menu-elem');
// let popUpNav = document.querySelectorAll('.popUp-body__menu-elem');
//
// function scrollToAnchors (params){
//     for (let i=0;i<params.length;i++){
//         params[i].addEventListener("click", function (){
//             let scroll_point_SERVICE = document.getElementById('service-block').getBoundingClientRect().y,
//                 scroll_point_PORTFOLIO = document.getElementById('portfolio').getBoundingClientRect().y,
//                 scroll_point_TEAM = document.getElementById('team').getBoundingClientRect().y,
//                 scroll_point_CONTACT = document.getElementById('contacts').getBoundingClientRect().y;
//             let scroll_points = [scroll_point_SERVICE,scroll_point_PORTFOLIO,scroll_point_TEAM,scroll_point_CONTACT];
//             popUp.classList.remove('popUpNav-active');
//
//             hamburger_elems[0].classList.remove("active");
//             hamburger_elems[1].classList.remove("active");
//             hamburger_elems[2].classList.remove("active");
//             window.scroll({
//                 top:scroll_points[i],
//                 behavior:"smooth"
//             });
//         },true);
//     }
// }
//
// scrollToAnchors(header_menu_elements);
// scrollToAnchors(popUpNav);
// // scroll to anchors------------------


//open/close nav-bar





// Hamburger Menu Spin
let cont_wrapper = document.querySelector(".contacts__wrapper");
let hamburger = document.querySelector(".burger");
let hamburger_elems = document.querySelectorAll(".burger__line");
let header_container = document.querySelector(".header__container");
let header_inner = document.querySelector(".header__inner.burger__inner");
let header_logo = document.querySelector(".header__logo");
let body = document.body;

// function openNav() {
//     for (let i = 0; i < hamburger.length;i++){
//         hamburger_elems[i].classList.add("active");
//     }
//     // document.getElementById("popUpNav").style.display = "block";
// }
// function closeNav() {
//     for (let i = 0; i < hamburger.length;i++){
//         hamburger_elems[i].classList.remove("active");
//     }
//     // document.getElementById("popUpNav").style.display = "none";
// }

let popUp = document.querySelector('.popUpNav');

hamburger.addEventListener('click', function (){
    for (let i = 0; i < hamburger_elems.length;i++){
        if (hamburger_elems[i].classList.contains("active")){
            hamburger_elems[i].classList.remove("active");
            cont_wrapper.classList.remove("active");

            // popUp.classList.remove('popUpNav-active')
        }else{
            hamburger_elems[i].classList.add("active");
            cont_wrapper.classList.add("active");
            body.style.overflow="hidden";
            // popUp.classList.add('popUpNav-active')


        }
    }
});



//open/close nav-bar------------------






