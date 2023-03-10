// nav bar show-images on hover
window.onscroll = function() {
    hideAnnoumentBar()
};

var header = document.querySelectorAll(".announcement-bar")[0];
var sticky = 20;

function hideAnnoumentBar() {
    if (window.pageYOffset > sticky) {
        header.classList.add("hide");
    } else {
        header.classList.remove("hide");
    }
}


const elem = document.querySelectorAll('.grand-menu-link');
elem.forEach(item => {
    item.addEventListener("mouseover", (event) => {
        var showimage = item.getAttribute('featured-image');
       
        const showimageItem = document.querySelectorAll('#' + showimage)[0];
        console.log(showimageItem)  
      showimageItem.classList.add("active");

    });
    item.addEventListener("mouseout", (event) => {
        const hiddenImage = document.querySelectorAll('.featureImage');
        hiddenImage.forEach(menuItems => {
            menuItems.classList.remove("active");;

        });
    });
});
function addtocartitem(item) {
    let varID = item
    let formData = {
        'items': [{
            'id': varID
            //'quantity':varQuantity
        }]
    };
    fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        .then(response => response.json())
        .then(data => {
            if (data.status >= 422) {
                alert(data.description);

            } else {
                fetch('/cart.js')
                    .then(response => response.text())
                    .then((responseText) => {
                        data = JSON.parse(responseText);
                        var counterEl = document.querySelectorAll('.cart-item-count');
                        counterEl.forEach((element) => {
                            element.innerHTML = data.item_count
                        })
                    })

                var miniCart = document.getElementById('mini-cart-sucess');

                var DataItems = data.items;
                DataItems.forEach(dataItem => {
                    var varImg = dataItem.featured_image.url;
                    var varTitle = dataItem.title;
                    var html = '<div class="image-box"><img src="' + varImg + '" class="cart-image" alt="' + varTitle + '"/</div>';
                    html += '<div class="info-box"><h3>Added to cart</h3><p>' + varTitle + '</p></div>'
                    miniCart.innerHTML = html
                })
                document.body.classList.add('product-toast');
                setTimeout(() => {
                    document.body.classList.remove('product-toast');
                    miniCart.innerHTML = '';
                }, '5000');
                cartDrwer()
            }


        })

        .catch((error) => {
            console.error('Error:', error);
        });
}


function SelectVariant(event) {
   var selectType = event.getAttribute('type')
    changeActive(event);
    if (selectType == "color"){
      ChnageVaiantImg(event)
    }else{
      ChangeSize(event)
    }
}
function ChangeSize(event){
   var mainParent = event.closest('.featured-product');
   var SelectorValue = mainParent.querySelectorAll('.size-selector.active');
    var slectedValue = [];
    SelectorValue.forEach((item, index) => {
        var optionIndex = mainParent.querySelectorAll('[data-option-size="'+index+'"] .size-selector.active')[0];
        var SelectValue = optionIndex.getAttribute('data-title');
        slectedValue.push(SelectValue);
    })
    var Selector = slectedValue.join(" / ")
    var mainselctbox = mainParent.querySelectorAll('select option');
    var dataAvability = "";
    var soldOut = [];
    var variantId = "";
    mainselctbox.forEach(item => {
        var text = item.innerText
        
        if (text === Selector) {
            console.log(text)
            variantId = item.value
            dataAvability = item.getAttribute('data-avability');
        }
    })
    // console.log(soldOut);

    var selectType = event.getAttribute('type')
    if (dataAvability == 'true') {
        if (selectType == "size") {
            addtocartitem(variantId)
        }
    } else {

    }
}
function changeActive(event) {
    var mainParent = event.closest('.featured-product');
    var childParent = event.closest('.selector-wrapper');
    var selcterValue = event.getAttribute('data-title')
    var SizeSelectorOption = childParent.querySelectorAll('.size-selector')
    SizeSelectorOption.forEach(sizeOption => {
        sizeOption.classList.remove("active");
    })
    event.closest('.size-selector').classList.add("active");
}

function ChnageVaiantImg(event) {
    var mainParent = event.closest('.featured-product');
    var SizeSelectorOption = mainParent.querySelectorAll('.size-selector');
    var prductUrl = mainParent.querySelectorAll('[data-url]')[0];
    prductUrl = prductUrl.getAttribute('data-url');
    SizeSelectorOption.forEach(sizeOption => {
        sizeOption.classList.remove("Sold-out");
    })
    var selcterValue = event.getAttribute('data-title');
    const JsonScript = JSON.parse(mainParent.querySelectorAll("script")[0].innerHTML);
    var topcontainer = mainParent.querySelectorAll('.top-container .product-image-container')[0]
    var SelectedColor = mainParent.querySelectorAll('.SelectedColor')[0];
    SelectedColor.innerHTML = selcterValue;
    topcontainer.innerHTML = ''
    var mainDiv = document.createElement('div');
    mainDiv.classList.add("product-image-slide");
    var newDiv = document.createElement('div');
    newDiv.classList.add("swiper-wrapper");
    JsonScript.forEach(images => {
        if (selcterValue === images.alt) {
            var swiperWrapp = document.createElement('div');
            swiperWrapp.classList.add('swiper-slide')
            swiperWrapp.setAttribute("data-swiper-autoplay", "1000");
            swiperWrapp.innerHTML = '<a href="' + prductUrl + '"><img class="borrder-all radius-20 feature-image" alt="'+ images.alt +'" src="' + images.src + '"></a>'
            newDiv.appendChild(swiperWrapp);
        }
    })
    var swiperPrev = document.createElement('div');
    swiperPrev.classList.add('swiper-button-prev')
    var swiperNext = document.createElement('div');
    swiperNext.classList.add('swiper-button-next');
    var htmlstring = newDiv.innerHTML
    htmlstring = (htmlstring.trim) ? htmlstring.trim() : htmlstring.replace(/^\s+/,'');
    
    if(htmlstring == '') {
    JsonScript.forEach(images => {
            var swiperWrapp = document.createElement('div');
            swiperWrapp.classList.add('swiper-slide')
            swiperWrapp.setAttribute("data-swiper-autoplay", "1000");
            swiperWrapp.innerHTML = '<a href="' + prductUrl + '"><img class="borrder-all radius-20 feature-image" alt="'+ images.alt +'" src="' + images.src + '"></a>'
            newDiv.appendChild(swiperWrapp);
    })
     mainDiv.append(newDiv)
    }else{
    
    mainDiv.append(newDiv)
    }
    topcontainer.append(swiperNext)
    topcontainer.append(swiperPrev)
    topcontainer.appendChild(mainDiv)
    // intilize slider
    var item = mainParent.querySelectorAll('.product-image-slide')[0];
    var newElem = mainParent.querySelectorAll('.product-image-container')[0]
    var nextbutton = newElem.querySelectorAll('.swiper-button-next')[0];
    var prebutton = newElem.querySelectorAll('.swiper-button-prev')[0];
    const swiperTabs = new Swiper(item, {
        loop: true,
        allowTouchMove: false,
        autoplay: 7000,
        speed: 300,
        slidesPerView: 1,
        noSwipingClass: 'swiper-no-swiping',
        initialSlide: 0,
        effect: 'fade',
        navigation: {
            nextEl: nextbutton,
            prevEl: prebutton,
        },
    })
    var swp = item.swiper
    item.addEventListener("mouseover", function() {
        swp.autoplay.start();
    })
    item.addEventListener("mouseout", function() {
        swp.autoplay.stop();
    })
    var mainselctbox = mainParent.querySelectorAll('select option');
    var soldOut = [];
    var totalOptionsSize = mainParent.querySelectorAll('[data-option-size]').length;
    mainselctbox.forEach(item => {	
        var text = item.innerText	
        if (text.indexOf(selcterValue) > -1) {	
            const dataAvability2 = item.getAttribute('data-avability');	
            if (dataAvability2 == 'false') {	
                const soldOutVariant = text.split(' / ');	
                if (totalOptionsSize == 1){	
                soldOut.push(soldOutVariant[0]);	
                }else if(totalOptionsSize == 2){	
                soldOut.push(soldOutVariant[0]);	
                soldOut.push(soldOutVariant[1]);  	
                }else if(totalOptionsSize == 3){	
                soldOut.push(soldOutVariant[0]);	
                soldOut.push(soldOutVariant[1]); 	
                soldOut.push(soldOutVariant[2]);  	
                }	
            }	
        }	
    })	
    if (soldOut.length > 0) {	
      //console.log(soldOut);	
        soldOut.forEach(sold => {	
            var soldItem = mainParent.querySelectorAll('.size-selector[data-title="' + sold + '"]')[0];	
            soldItem.innerHTML += '<svg class="svgSold" data-name="Bell Icon" xmlns="http://www.w3.org/2000/svg" role="presentation" viewBox="0 0 448 512" class="icon-bell h-[15px] px-[5px] fill-secondary"><path d="M256 32V51.2C329 66.03 384 130.6 384 208V226.8C384 273.9 401.3 319.2 432.5 354.4L439.9 362.7C448.3 372.2 450.4 385.6 445.2 397.1C440 408.6 428.6 416 416 416H32C19.4 416 7.971 408.6 2.809 397.1C-2.353 385.6-.2883 372.2 8.084 362.7L15.5 354.4C46.74 319.2 64 273.9 64 226.8V208C64 130.6 118.1 66.03 192 51.2V32C192 14.33 206.3 0 224 0C241.7 0 256 14.33 256 32H256zM224 512C207 512 190.7 505.3 178.7 493.3C166.7 481.3 160 464.1 160 448H288C288 464.1 281.3 481.3 269.3 493.3C257.3 505.3 240.1 512 224 512z"></path></svg>';	
            soldItem.classList.add('Sold-out');	
        })	
    }
    // var soldOut = [];
    // mainselctbox.forEach(item => {
    //     var text = item.innerText
    //     if (text.indexOf(selcterValue) > -1) {
    //         const dataAvability2 = item.getAttribute('data-avability');
    //         if (dataAvability2 == 'false') {
    //             const soldOutVariant = text.split(' / ');
    //             soldOut.push(soldOutVariant[0]);
    //         }
    //     }
    // })
    // if (soldOut.length > 0) {
    //     //console.log(soldOut)
    //     soldOut.forEach(sold => {
    //         var soldItem = mainParent.querySelectorAll('.size-selector[data-title="' + sold + '"]')[0];
    //         soldItem.classList.add('Sold-out');
    //     })
    // }
}

function triggerChange(element) {
    let changeEvent = new Event('change');
    element.dispatchEvent(changeEvent);
}




// collection-tapping slider
var CollectionTabSection = document.querySelectorAll('.collection-tabbing');
CollectionTabSection.forEach(item => {
    const navbtn = item.querySelectorAll('.tablinks')
    console.log(navbtn)
    const CollectionTabSection = new Swiper(item, {
        slidesPerView: 1,
        speed: 500,
        allowTouchMove: false,
        initialSlide: 0,
    })

    function slide(e) {
        let target = e.target;
        let index = target.getAttribute('data-index');
        CollectionTabSection.slideTo(index);
    }
    navbtn.forEach(item => {
        item.addEventListener('click', event => {
            slide(event)
        })
    })

})

var CollectionSlider = document.querySelectorAll('.collection-list');
CollectionSlider.forEach(item => {
    var nextbutton = item.querySelectorAll('.tabingNext')[0];
    var prebutton = item.querySelectorAll('.tabingPrev')[0];
    const swiperTabs = new Swiper(item, {
        slidesPerView: 2,
        spaceBetween: 15,
        initialSlide: 0,
        navigation: {
            nextEl: nextbutton,
            prevEl: prebutton,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
            1366: {
                slidesPerView: 5,

            },
        },
    })
})



// var collcetionImageSlider = document.querySelectorAll('.product-image-wrapper');
// collcetionImageSlider.forEach(item => {
//     var newElem = item.closest('.product-image-container')
//     var nextbutton = newElem.querySelectorAll('.swiper-button-next')[0];
//     var prebutton = newElem.querySelectorAll('.swiper-button-prev')[0];
//     const swiperTabs = new Swiper(item, {
//         allowTouchMove: false,
//         loop: true,
//         autoplay: 7000,
//         speed: 300,
//         noSwiping: true,
//         slidesPerView: 1,
//         initialSlide: 0,
//         effect: 'fade',
//         navigation: {
//             nextEl: nextbutton,
//             prevEl: prebutton,
//         },
//     })
//     var swp = item.swiper
//     item.addEventListener("mouseover", function() {
//         swp.autoplay.start();
//     })
//     item.addEventListener("mouseout", function() {
//         swp.autoplay.stop();
//     })
// });



var variantImages = document.querySelectorAll('.prodouct-variant-slider');

variantImages.forEach(slider => {
    var swiperActive = slider.querySelectorAll('.size-selector')[0];
    if (swiperActive !== '') {
        swiperActive.classList.add('active')
        var label = swiperActive.querySelectorAll('label')[0];
        label.click()
        const slideritam = new Swiper(slider, {
            slidesPerView: 5,
            initialSlide: 0,
            spaceBetween: 5,
            draggable: true,
        })
    }
})


var shopContainer = document.querySelectorAll('.shoplock-container');

shopContainer.forEach(item => {
    var nextbutton = item.querySelectorAll('.swiper-button-next.swiper-next')[0];
    var prebutton = item.querySelectorAll('.swiper-button-prev.swiper-prev')[0];
    const shopTabs = new Swiper(item, {
        slidesPerView: 1,
        initialSlide: 0,
        autoHeight: true,
        navigation: {
            nextEl: nextbutton,
            prevEl: prebutton,
        },
    })
})



var shopContainer = document.querySelectorAll('.shopock-product-container');

shopContainer.forEach(item => {
    const nav = item.closest('.shoplock-image-container');
    const navbtn = nav.querySelectorAll('.DotsBox .dotsAnimate')
    const shopContainerTabs = new Swiper(item, {
        slidesPerView: 1,
        grabCursor: false,
        mousewheel: {
            enabled: true,
            sensitivity: 5.5,
        },
    })
    shopContainerTabs.on('slideChange', function() {
        const item = this.$el;
        const parent = item.closest('.shoplock-image-container');
        const m_fixed = item.closest('.shoplock-slider');
        m_fixed[0].classList.add('m_fixed')
        const sliderNav = parent[0].querySelectorAll('.DotsBox .dotsAnimate');
        // navigation change active class
        sliderNav.forEach(e => {
            if (e.getAttribute("data-index") === this.activeIndex.toString()) {
                //console.log(e.getAttribute("data-index"))
                e.classList.add('active');
            } else {
                e.classList.remove('active');
            }
        });
    });

    function slide(e) {
        let target = e.target;
        if (target.classList[0] === 'dotsAnimate') {
            let index = target.getAttribute('data-index');
            shopContainerTabs.slideTo(index);
        }
    }
    navbtn.forEach(item => {
        item.addEventListener('click', event => {
            slide(event)
        })
    })

})

function removemfixed(item) {
    const m_fixed = item.closest('.shoplock-slider');
    //console.log(m_fixed)
    m_fixed.classList.remove('m_fixed');

}

// search box function 
openModal = (event) => {
    document.body.classList.add('modal-search-open');
}
hideModal = (event) => {
    document.body.classList.remove('modal-search-open');
}
var seachTrigger = document.querySelectorAll('#SeachTrigger')[0];
seachTrigger.addEventListener('click', event => {
    openModal(event)
})
menuOpen = (event) => {
    document.body.classList.add('modal-menu-open');
    var firstmenu = document.querySelectorAll('li.menu-link.has-child-links')[0];
    firstmenu.classList.add('active')
}
menuClose = (event) => {
    document.body.classList.remove('modal-menu-open');
}

var CratDrawerSlider = document.querySelectorAll('.CratDrawerSlider');
CratDrawerSlider.forEach(item => {
    var nextbutton = item.querySelectorAll('.CartDrawerNext')[0];
    var prebutton = item.querySelectorAll('.CartDrawerPrev')[0];
    const cartDrawerSwaper = new Swiper(item, {
        slidesPerView: 2,
        spaceBetween: 15,
        initialSlide: 0,
        navigation: {
            nextEl: nextbutton,
            prevEl: prebutton,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
            1366: {
                slidesPerView: 4,

            },
            1400: {
                slidesPerView: 5,

            },
        },
    })
})