'use strict'

// スライドのアニメーションを管理するクラス
class SlideAnimator {
    constructor() {
        this.target    = null;
        this.startTime = 0;
        this.startX    = 0;
        this.endX      = 0;
        this.duration  = 1000;
    }

    start() {
        this.startTime = performance.now();
    }

    setTarget(e) {
        this.target = e;
    }

    setDuration(d) {
        this.duration = d;
    }

    appear() {
        const reqID = requestAnimationFrame(this.appear.bind(this));

        const elapsed = performance.now() - this.startTime;
        const opacity = this.getProgress('linear', elapsed, 0, 1, this.duration);
        this.target.style.opacity = `${opacity}`;

        if(opacity >= 1) {
            cancelAnimationFrame(reqID);
        }
    }

    // e: easingType
    // t: current time
    // b: begining value
    // c: change in value
    // d: duration
    getProgress(e, t, b, c, d) {
        let progress = 0;

        if(t < 0) return b;
        if(t > d) return c;

        switch(e) {
            case 'linear':
                progress = c * t / d + b;
                break;
            case 'easeInSine':
                progress = -c * Math.cos(t / d * Math.PI) + c + b;
                break;
            default:
                break;
        }
        return progress;
    }
}


// スライドを管理するクラス
class Slide {
    constructor(targetID, prevBtnID, nextBtnID, animator, images) {
        this.target   = document.getElementById(targetID);
        this.prevBtn  = document.getElementById(prevBtnID);
        this.nextBtn  = document.getElementById(nextBtnID);
        this.animator = animator;
        this.images   = images;
        this.index    = 0;
        this.timer    = null;
        this.prevBtn.addEventListener('click', this.onclickPrevBtn.bind(this));
        this.nextBtn.addEventListener('click', this.onclickNextBtn.bind(this));
        document.querySelectorAll('.navi-item').forEach(e => {
            e.addEventListener('click', this.onclickNavi.bind(this));
        });

        this.update(this.index);
    }

    setAnimator(animator) {
        this.animator = animator;
    }

    setAutoAnimation() {
        this.timer = setInterval(this.onclickNextBtn.bind(this), 5000);
    }

    resetAutoAnimation() {
        clearInterval(this.timer);
        this.setAutoAnimation();
    }

    onclickPrevBtn() {
        if(this.animator === null) return;
        this.update(this.index - 1);
    }

    onclickNextBtn() {
        if(this.animator === null) return;
        this.update(this.index + 1);
    }

    onclickNavi(e) {
        const index = Number(e.target.dataset.index);
        this.update(index);
    }

    update(index) {
        this.resetAutoAnimation()
        this.updateIndex(index)
        this.updateSlide();
        this.updateNavi();
    }

    updateIndex(index) {
        if(index < 0) {
            this.index = this.images.length -1;
            return;
        }

        if(index >= this.images.length) {
            this.index = 0;
            return;
        }
        
        this.index = index;
    }

    updateSlide() {
        const e = document.createElement('img');
        e.setAttribute('src', this.images[this.index]);
        e.style.opacity  = 0;
        e.style.position = 'absolute';
        this.target.insertAdjacentElement('beforeend', e);
        this.animator.setTarget(e);
        this.animator.start();
        this.animator.appear();
    }

    updateNavi() {
        const navi = document.querySelectorAll('.navi-item');
        for(let i = 0; i < navi.length; i++) {
            navi[i].style.background = '#CCCCCC';
            if(i === this.index) {
                navi[i].style.background = '#000000';
            }
        }
    }
}

const animator = new SlideAnimator();
const images = [
    '../img/sample1.jpeg', 
    '../img/sample2.jpeg', 
    '../img/sample3.jpeg', 
    '../img/sample4.jpeg', 
    '../img/sample5.jpeg'
];
const slide = new Slide('js-slide', 'js-prev-btn', 'js-next-btn', animator, images);
