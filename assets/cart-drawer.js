function cartDrawerOpen(params) {
    cartDrwer()
    console.log("yes")
    document.getElementById('shopify-section-cart-drawer').classList.add('active');
}
// close cart function
function cartDrwerclose() {
    document.getElementById('shopify-section-cart-drawer').classList.remove('active');
}

// section render
function rendersection() {
    let html = this.responseText;
}

function cartDrwer() {
    fetch(window.Shopify.routes.root + "/cart?section_id=cart-drawer")
        .then(response => response.text())
        .then((responseText) => {
            const parsedHTML = new DOMParser().parseFromString(responseText, 'text/html').getElementById('shopify-section-cart-drawer').innerHTML;
            var container = document.createElement("div");
            document.getElementById('cart_drawer_box').innerHTML = parsedHTML;
            var counterEl = document.querySelectorAll('.cart-item-count');
            var CratDrawerSlider = document.querySelectorAll('.CratDrawerSlider');
            console.log("CratDrawerSlider")
            CratDrawerSlider.forEach(item => {
                var nextbutton = item.querySelectorAll('.CartDrawerNext')[0];
                var prebutton = item.querySelectorAll('.CartDrawerPrev')[0];
                //console.log(nextbutton)
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
            var collcetionImageSlider = document.querySelectorAll('.product-image-wrapper');
            collcetionImageSlider.forEach(item => {
                var newElem = item.closest('.product-image-container')
                var nextbutton = newElem.querySelectorAll('.swiper-button-next')[0];
                var prebutton = newElem.querySelectorAll('.swiper-button-prev')[0];
                const swiperTabs = new Swiper(item, {
                    loop: true,
                    allowTouchMove: false, 
                    autoplay: 7000,
                    speed: 300,
                    noSwiping: true,
                    slidesPerView: 1,
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
            });
            var variantImages = document.querySelectorAll('.prodouct-variant-slider');
            variantImages.forEach(slider => {
                var swiperActive = slider.querySelectorAll('.size-selector')[0];
                // console.log("this"+swiperActive);
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
        })
}
//remove items from cart drawer
function removeItem(item) {
    let url = item.getAttribute('url');
    fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                cartDrwer();
            } else {
                alert(response.description)
            }
        })
        .catch((error) => {
            console.error('Error:', error.message);
        });
}
//add items in cart drawer

//increase product Quantity 
function addQuantity(item) {
    const varQuantity = parseInt(item.getAttribute('data-variant')) + 1;
    const variantId = item.getAttribute('data-id')
    fetch(window.Shopify.routes.root + 'cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity: varQuantity,
                id: variantId
            })
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                cartDrwer();
            } else {
                alert(response.description)
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}

// decrease product Qunatity
function removeQuantity(item) {
    const varQuantity = parseInt(item.getAttribute('data-variant')) - 1;
    const variantId = item.getAttribute('data-id')
    fetch(window.Shopify.routes.root + 'cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity: varQuantity,
                id: variantId
            })
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                cartDrwer();
            } else {
                alert(response.description)
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}