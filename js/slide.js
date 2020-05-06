'use strict'

// スライドのアニメーションを管理するクラス
class SlideAnimator {
    constructor(targetID) {
        this.target    = document.getElementById(targetID);
        this.startTime = 0;
        this.startX    = 0;
        this.endX      = 0;
        this.duration  = 0;
    }

    start() {
        this.startTime = performance.now();
    }

    setProparties(startX, endX, duration){
        this.startX    = startX;
        this.endX      = endX;
        this.duration  = duration;
    }

    prev() {
        const reqID = requestAnimationFrame(this.prev.bind(this));

        const elapsed = performance.now() - this.startTime;
        const left = this.getProgress('linear', elapsed, this.startX, this.endX, this.duration);
        this.target.style.left = `${left}px`;
        document.getElementById('target1').innerHTML = `left: ${left}`;

        if(left >= this.endX) {
            cancelAnimationFrame(reqID);
            this.target.style.left = `${this.endX}px`;
        }
    }

    next() {
        const reqID = requestAnimationFrame(this.next.bind(this));

        const elapsed = performance.now() - this.startTime;
        const left = this.getProgress('linear', elapsed, this.startX, this.endX, this.duration);
        this.target.style.left = `${left}px`;

        if(left <= this.endX) {
            cancelAnimationFrame(reqID);
            this.target.style.left = `${this.endX}px`;
        }
    }

    appear() {
        const reqID = requestAnimationFrame(this.appear.bind(this));

        const elapsed = performance.now() - this.startTime;
        const opacity = this.getProgress('linear', elapsed, 0, 1, 1000);
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
    constructor(targetID, prevBtnID, nextBtnID, animator) {
        this.target   = document.getElementById(targetID);
        this.prevBtn  = document.getElementById(prevBtnID);
        this.nextBtn  = document.getElementById(nextBtnID);
        this.animator = animator;
        this.index    = 0;
        this.images   = ['../img/sample1.jpeg', '../img/sample2.jpeg', '../img/sample3.jpeg', '../img/sample4.jpeg', '../img/sample5.jpeg'];
        this.prevBtn.addEventListener('click', this.onclickPrevBtn.bind(this));
        this.nextBtn.addEventListener('click', this.onclickNextBtn.bind(this));
        document.querySelectorAll('.navi-item').forEach(e => {
            e.addEventListener('click', this.onclickNavi.bind(this));
        });

        this.run(this.index);
    }

    setSlideAnimator(animator) {
        this.animator = animator;
    }

    setSlide() {
        const e = document.createElement('img');
        e.setAttribute('src', this.images[this.index]);
        e.style.opacity  = 0;
        e.style.position = 'absolute';
        this.target.insertAdjacentElement('beforeend', e);
        this.animator.target = e;
        this.animator.start();
        this.animator.appear();
    }

    onclickPrevBtn() {
        if(this.animator === null) return;
        if(this.index === 0) return;
        this.run(this.index - 1);
    }

    onclickNextBtn() {
        if(this.animator === null) return;
        if(this.index === this.images.length -1) return;
        this.run(this.index + 1);
    }

    onclickNavi(e) {
        const index = Number(e.target.dataset.index);
        this.run(index);
    }

    run(index) {
        this.index = index;
        this.setSlide();
        this.setNavigation();
    }

    setNavigation() {
        const navi = document.querySelectorAll('.navi-item');
        for(let i = 0; i < navi.length; i++) {
            navi[i].style.background = '#CCCCCC';
            if(i === this.index) {
                navi[i].style.background = '#000000';
            }
        }
    }

    // prev() {
    //     const start = this.left;
    //     const end   = start + 500;
    //     const time  = 1000;
    //     this.slideAnimator.setProparties(-1000, -500, time);
    //     this.slideAnimator.start();
    //     this.slideAnimator.prev();
    //     this.left = end;
    // }

    // next() {
    //     const start = this.left;
    //     const end   = start - 500;
    //     const time  = 1000;
    //     this.slideAnimator.setProparties(-500, -1000, time);
    //     this.slideAnimator.start();
    //     this.slideAnimator.next();
    //     this.left = end;
    // }

}

const animator = new SlideAnimator('js-slide');
const slide = new Slide('js-slide', 'js-prev-btn', 'js-next-btn', animator);
