/* eslint-disable camelcase */
import device from 'current-device';
import "@/styles/common/index.scss";
import "@/styles/index.scss";
import "@/styles/iconfont.scss";
import { loadScript, loadLink } from "./common/helper";
// SVG
import "@/icons/index.js";
// ES6引入Swiper，但是IE报错，需要后续研究
// Import Swiper and modules
// import { Swiper, Navigation, Pagination, Parallax, Autoplay, Lazy, EffectCoverflow, Keyboard } from 'swiper/js/swiper.esm.js';
// import "swiper/css/swiper.min.css";

// Install modules
// Swiper.use([Navigation, Pagination, Parallax, Autoplay, Lazy, EffectCoverflow, Keyboard]);

$(function() {
    const isMobile = device.mobile();

    if (isMobile) {
        layer.msg('更多精彩内容请前往PC端查看！');
    }

    var autoScrollTimer = null;

    var swiper1;

    var swiper2;

    var swiper3;

    var swiper4;

    var swiperDrawer;

    var swiperGallery;

    var swiperProjects;

    var map;

    var blogLoading;

    layer.config({
        skin: 'layer-custom-skin'
    });

    initFullPage();

    registerEvents();

    polyfillAnim();

    createSection2Swipers();

    initSwiperDrawer();

    initSwiperProjects();

    // 初始化fullpage
    function initFullPage() {
        $('#fullPage').fullpage({
            anchors: ['hi', 'education', 'career', 'projects', 'blogs', 'contact'],
            menu: '#menu',
            navigation: true,
            easingcss3: 'ease',
            controlArrows: false,
            loopHorizontal: true,
            scrollingSpeed: 400,
            afterLoad: function(anchorLink, index) {
                if (index === 2) {
                    // education加载时，初始化第一个swiper实例
                    swiper1.init();
                    $.fn.fullpage.moveTo(2, 0);
                    const iconDom = $('.focus-anim >i').eq(0);
                    triggerC3Animation(function() {
                        iconDom.removeClass('shake animated');
                    }, function() {
                        iconDom.addClass('shake animated');
                    });
                    // startAutoSlideHorizontal();
                } else {
                    stopAutoSlideHorizontal();
                }

                if (index === 3) {
                    // career
                    swiper4.init();
                    const parallaxDom = $('.parallax-bg');
                    if (parallaxDom.css('backgroundImage') === 'none') {
                        parallaxDom.css('backgroundImage', `url(${parallaxDom.data('background')})`);
                    }
                }

                if (index === 4) {
                    // what i do
                    swiperProjects.init();
                }

                if (index === 5) {
                    // blog
                    getBlogList();
                }

                if (index === 6) {
                    // contact
                    loadBgImg('contact-section');
                    if (!isMobile && !map) {
                        // 加载search插件
                        loadLink('http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.css');
                        loadScript('http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.js', document.querySelector('head')).then(res => {
                            renderMap();
                        });
                    }
                }
            },
            onLeave: function(index, nextIndex, direction) {
                if (index === 5) {
                    // 离开blog section
                    closeBlogLoading();
                } else if (index === 6) {
                    // 离开联系页，如果打开了微信tips层，需要关闭
                    layer.closeAll('tips');
                }
            },
            onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex) {
                const iconDom = $('.focus-anim >i').eq(nextSlideIndex);
                triggerC3Animation(function() {
                    iconDom.removeClass('shake animated');
                }, function() {
                    iconDom.addClass('shake animated');
                });
                if (nextSlideIndex === 2) {
                    swiper2.init();
                } else if (nextSlideIndex === 3) {
                    swiper3.init();
                }
            }
        });
    }

    function createSection2Swipers() {
        const isIE = /(msie)|(trident)/i.test(navigator.userAgent);

        const options1 = {
            init: false,
            loop: true,
            autoPlay: {
                delay: 2000
            },
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            initialSlide: 1,
            preloadImages: false,
            lazy: {
                loadPrevNext: true
            },
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true
            },
            on: {
                sliderMove: function(event) {
                    stopAutoSlideHorizontal();
                },
                touchEnd: function(event) {
                    startAutoSlideHorizontal();
                }
            }
        };

        const options2 = {
            init: false,
            loop: true,
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            preloadImages: false,
            lazy: {
                loadPrevNext: true
            },
            on: {
                sliderMove: function(event) {
                    stopAutoSlideHorizontal();
                },
                touchEnd: function(event) {
                    startAutoSlideHorizontal();
                }
            }
        };

        let options;

        if (isIE) {
            $('.swiper-container').addClass('is-ie');
            options = options2;
        } else {
            options = options1;
        }

        swiper1 = new Swiper('.swiper-container1', options);

        swiper2 = new Swiper('.swiper-container2', options);

        swiper3 = new Swiper('.swiper-container3', options);

        // 第三屏
        swiper4 = new Swiper('.swiper-container4', {
            init: false,
            loop: true,
            speed: 600,
            parallax: true,
            keyboard: {
                enabled: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
    }

    function initSwiperDrawer() {
        swiperDrawer = new Swiper('.swiper-drawer', {
            slidesPerView: 'auto',
            initialSlide: 1,
            resistanceRatio: 0,
            slideToClickedSlide: true,
            allowTouchMove: false,
            on: {
                slideChangeTransitionStart: function() {
                    var slider = this;
                    if (slider.activeIndex === 0) {
                        // 抽屉显示时，锁定fullpage滚动
                        lockFullpageScroll();
                    }
                },
                slideChangeTransitionEnd: function() {
                    var slider = this;
                    if (slider.activeIndex === 1) {
                        // 抽屉隐藏后，解锁fullpage滚动
                        unlockFullpageScroll();
                    } else {
                        swiperGallery.init();
                    }
                }
            }
        });

        var lastBtnKey = '';

        $('.swiper-container4').on('click', '.btn-more', function() {
            const tpl1 = '<div class="swiper-slide">' +
                            '<div data-background="https://qncdn.wbjiang.cn/kulu_login.png" class="swiper-lazy">' +
                            '    <div class="swiper-lazy-preloader"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="swiper-slide">' +
                            '<div data-background="https://qncdn.wbjiang.cn/kulu_map.png" class="swiper-lazy">' +
                                '<div class="swiper-lazy-preloader"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="swiper-slide">' +
                            '<div data-background="https://qncdn.wbjiang.cn/kulu_table.png" class="swiper-lazy">' +
                                '<div class="swiper-lazy-preloader"></div>' +
                            '</div>' +
                        '</div>';
            const tpl2 = '<div class="swiper-slide">' +
                        '<div data-background="https://qncdn.wbjiang.cn/zjzt_you_xiu.jpg" class="swiper-lazy">' +
                        '    <div class="swiper-lazy-preloader"></div>' +
                        '</div>' +
                    '</div>';
            const tpl3 = '<div class="swiper-slide">' +
                        '<a href="https://mp.weixin.qq.com/s/EMatPwXQBQefY1sxq_qVlQ" target="_blank" title="click to learn more">' +
                            '<div data-background="https://qncdn.wbjiang.cn/you_xiu_ying_jie_sheng.jpg" class="swiper-lazy">' +
                            '    <div class="swiper-lazy-preloader"></div>' +
                            '</div>' +
                        '</a>' +
                    '</div>' +
                    '<div class="swiper-slide">' +
                        '<a href="https://mp.weixin.qq.com/s/erfEtxTRwXV91xuyw_83_A" target="_blank" title="click to learn more">' +
                            '<div data-background="https://qncdn.wbjiang.cn/xiao_lv_zhi_xing.jpg" class="swiper-lazy">' +
                                '<div class="swiper-lazy-preloader"></div>' +
                            '</div>' +
                        '</a>' +
                    '</div>' +
                    '<div class="swiper-slide">' +
                        '<div data-background="https://qncdn.wbjiang.cn/you_xiu_tuan_dui.jpg" class="swiper-lazy">' +
                            '<div class="swiper-lazy-preloader"></div>' +
                        '</div>' +
                    '</div>';
            const btnKey = $(this).data('btn-key');
            if (btnKey !== lastBtnKey) {
                if (lastBtnKey) {
                    swiperGallery.destroy();
                }
                window.requestAnimFrame(function() {
                    createSwiperGallery();
                    const wrapper = $('.swiper-gallery .swiper-wrapper');
                    switch (btnKey) {
                        case 'kl':
                            wrapper.html(tpl1);
                            break;
                        case 'zjzt':
                            wrapper.html(tpl2);
                            break;
                        case 'zrgj':
                            wrapper.html(tpl3);
                            break;
                        default:
                            break;
                    }
                    swiperGallery.init();
                });
            }
            lastBtnKey = btnKey;
            if (swiperDrawer.activeIndex === 1) {
                swiperDrawer.slidePrev();
            }
        });
    }

    function initSwiperProjects() {
        swiperProjects = new Swiper('.swiper-projects', {
            init: false,
            slidesPerView: 'auto',
            spaceBetween: 60,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            keyboard: {
                enabled: true
            }
        });
    }

    function createSwiperGallery() {
        swiperGallery = new Swiper('.swiper-gallery', {
            direction: 'vertical',
            init: false,
            loop: true,
            preloadImages: false,
            lazy: {
                loadPrevNext: true
            },
            slidesPerView: 1,
            spaceBetween: 30,
            mousewheel: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            }
        });
    }

    function registerEvents() {
        $('.icon-left-circle').on('click', function() {
            stopAutoSlideHorizontal();
            $.fn.fullpage.moveSlideLeft();
            startAutoSlideHorizontal();
        });

        $('.icon-right-circle').on('click', function() {
            stopAutoSlideHorizontal();
            $.fn.fullpage.moveSlideRight();
            startAutoSlideHorizontal();
        });

        $('.focus-anim').on('mouseenter', function() {
            const iconDom = $(this).children('i');
            triggerC3Animation(function() {
                iconDom.removeClass('shake animated');
            }, function() {
                iconDom.addClass('shake animated');
            });
        });

        $('#allmap').on('mouseenter', function() {
            lockFullpageScroll();
        });

        $('#allmap').on('mouseleave', function() {
            unlockFullpageScroll();
        });

        $('.social-list').on('click', 'li', showTipsMsg);

        $('.social-list').on('mouseenter', 'li', showTipsMsg);

        $('.social-list').on('mouseleave', 'li', function() {
            layer.closeAll('tips');
        });

        $('#btnSubmit').on('click', submitMessage);
    }

    // 5S后开始第二页水平fullpage的自动滚动
    function startAutoSlideHorizontal() {
        autoScrollTimer = setInterval(function() {
            $.fn.fullpage.moveSlideRight();
        }, 5000);
    }

    // 停止第二页水平fullpage的自动滚动
    function stopAutoSlideHorizontal() {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
    }

    // 解锁fullpage的滚动
    function unlockFullpageScroll() {
        $.fn.fullpage.setAllowScrolling(true);
        $.fn.fullpage.setKeyboardScrolling(true);
        $('#fp-nav').show();
    }

    // 锁定fullpage的滚动
    function lockFullpageScroll() {
        $.fn.fullpage.setAllowScrolling(false);
        $.fn.fullpage.setKeyboardScrolling(false);
        $('#fp-nav').hide();
    }

    // 获取博客列表
    function getBlogList() {
        blogLoading = layer.load();
        $.ajax({
            method: 'GET',
            url: '/api/article/page',
            contentType: 'application/json',
            dataType: 'json',
            data: {
                pageNo: 1,
                pageSize: 5
            }
        }).done(res => {
            if (res.code === '0') {
                res.data.forEach((item, index) => {
                    renderBlogItem(item, index + 1);
                });
            }
            closeBlogLoading();
        }).fail(() => {
            $('#blog-wrapper').html('<div class="loading-err">加载失败...</div>');
            closeBlogLoading();
        });
    }

    // 关闭loading
    function closeBlogLoading() {
        if (blogLoading) {
            layer.close(blogLoading);
            blogLoading = null;
        }
    }

    // 渲染博客卡片
    function renderBlogItem(item, no) {
        const tpl = '<a href="$1" target="_blank">' +
            '<img src="$2">' +
            '<div class="detail-wrapper">' +
                '<div class="blog-detail">' +
                    '<h3>$3</h3>' +
                    '<h4>$4</h4>' +
                    '<div class="go-to-read">' +
                        'Read more' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</a>';
        const linkBase = 'https://blog.wbjiang.cn/article/';
        let template = tpl.replace('$1', linkBase + item.id)
            .replace('$2', item.poster)
            .replace('$3', item.article_name)
            .replace('$4', item.tags.map(item => item.tagName).join(', '));
        $('#blog-' + no).html(template);
    }

    function polyfillAnim() {
        window.requestAnimFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) { window.setTimeout(callback, 1000 / 60); };
    }

    function loadBgImg(domId) {
        const _dom = $('#' + domId);
        const dataBgUrl = _dom.data('background');
        if (dataBgUrl) {
            _dom.css('backgroundImage', `url(${dataBgUrl})`).removeAttr('data-background');
        }
    }

    // 弹出tips层
    function showTipsMsg() {
        const _dom = $(this);
        const infoType = _dom.data('type');
        if (infoType === 'text') {
            layer.tips(_dom.data('text'), this, {
                tips: 3,
                time: 0
            });
        } else if (infoType === 'img') {
            const img = `<img width="200px" src="${_dom.data('url')}">`;
            layer.tips(img, this, {
                skin: 'layer-img',
                tips: 3,
                time: 0,
                area: '220px'
            });
        }
    }

    // 提交表单
    function submitMessage() {
        const formDom = $('#formComment');
        const fields = formDom.serializeArray();
        const valid = validateForm(formDom, fields);
        const fields2Obj = {};
        fields.forEach(item => {
            fields2Obj[item.name] = item.value;
        });
        if (valid) {
            // submit a comment
            $.ajax({
                method: 'POST',
                url: '/api/comment/add',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    ...fields2Obj,
                    approved: 0,
                    article_id: null
                })
            }).done(res => {
                if (res.code === '0') {
                    layer.msg('According to relevant laws and regulations, the message will be publicly displayed after the approval.');
                }
            }).fail(() => {
                layAlert('Submit failed.');
            });
        }
    }

    // 验证表单
    function validateForm(formDom, fields) {
        let isValid = true;
        outer: for (let index = 0; index < fields.length; index++) {
            const field = fields[index];
            const fieldDom = formDom.find(`input[name=${field.name}],textarea[name=${field.name}]`);
            const fieldValue = fieldDom.val();
            const label = fieldDom.prev().text();
            const isRequired = fieldDom.data('required');
            if (isRequired !== undefined && fieldValue === '') {
                layAlert(`${label} cannot be empty.`);
                isValid = false;
                break outer;
            }
            const rules = fieldDom.data('rules');
            if (rules) {
                const rulesArr = rules.split(',');
                for (let inde = 0; inde < rulesArr.length; inde++) {
                    const rule = rulesArr[inde];
                    if (rule === 'no-special' && /[^\u4e00-\u9fa5a-zA-Z0-9_]/.test(fieldValue)) {
                        layAlert(`${label} cannot contain special characters.`);
                        isValid = false;
                        break outer;
                    }
                    if (/^minlength=/.test(rule)) {
                        const minlength = rule.split('=')[1];
                        if (fieldValue.length < minlength) {
                            layAlert(`${label} cannot be entered less than ${minlength} digits.`);
                            isValid = false;
                            break outer;
                        }
                    }
                    if (/^maxlength=/.test(rule)) {
                        const maxlength = rule.split('=')[1];
                        if (fieldValue.length > maxlength) {
                            layAlert(`${label} cannot be entered more than ${maxlength} digits.`);
                            isValid = false;
                            break outer;
                        }
                    }
                    if (rule === 'email' && fieldValue !== '' && !/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/.test(fieldValue)) {
                        layAlert('You entered an invalid email.');
                        isValid = false;
                        break outer;
                    }
                    if (rule === 'url' && fieldValue !== '' && !/^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/.test(fieldValue)) {
                        layAlert('You entered an invalid website URL.');
                        isValid = false;
                        break outer;
                    }
                }
            }
        }
        return isValid;
    }

    function layAlert(msg) {
        layer.alert(msg, { title: 'Tips', btn: 'Got it' });
    }

    // 渲染地图
    function renderMap() {
        const locationPoint = new BMap.Point(112.911, 28.202);
        map = new BMap.Map("allmap");
        map.enableScrollWheelZoom(true);
        map.enableDoubleClickZoom(true);
        map.centerAndZoom(locationPoint, 17);

        const marker = new BMap.Marker(locationPoint); // 创建marker对象
        marker.addEventListener("click", function(e) {
            searchInfoWindow.open(marker);
        });
        map.addOverlay(marker);

        const content = '<img width="100%" height="100%" style="object-fit:cover" src="http://www.csmxh.com/uploads/allimg/140505/1-140505125103564.jpg">';

        const searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
            title: "梅溪湖金茂广场南塔",
            width: 240,
            height: 90,
            panel: "panel", // 检索结果面板
            enableAutoPan: true, // 自动平移
            enableSendToPhone: true, // 是否启动发送到手机功能
            searchTypes: [
                BMAPLIB_TAB_SEARCH, // 周边检索
                BMAPLIB_TAB_TO_HERE, // 到这里去
                BMAPLIB_TAB_FROM_HERE // 从这里出发
            ]
        });
        searchInfoWindow.open(locationPoint);
    }

    // 重新激活动画，需要传入移除动画class的方法，和设置动画class的方法
    function triggerC3Animation(removeAnimClass, setAnimClass) {
        removeAnimClass();
        window.requestAnimFrame(function() {
            window.requestAnimFrame(function() {
                setAnimClass();
            });
        });
    }
});
