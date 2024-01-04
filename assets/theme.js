// Shopify Money Format 
var Shopify = Shopify || {};
// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
Shopify.money_format = window.theme.moneyFormat;
Shopify.formatMoney = function(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);

  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) { return 0; }

    number = (number/100.0).toFixed(precision);

    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};

var myTimeout = setTimeout(myGreeting, 2000);
function myGreeting() {
  var element = document.getElementById("flashWrapper");
  if(element){
    element.classList.add('in-active')
  }
}
window.addEventListener("beforeunload", (event) => {
    document.getElementById("flashWrapper").classList.remove('in-active');
})

(function () {
    window.onpageshow = function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    };
})();
// lazy loding Images

var observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0.0) {
                img = entry.target;
                if (!img.hasAttribute('src')) {
                    //alert('will load the image!!!');
                    img.setAttribute('src', img.dataset.src);
                }
            }
        });
    },
    {}
)
for (let img of document.getElementsByTagName('img')) {
    observer.observe(img);
}

// AnnouncmentBar //
var AnnouncmentBar = document.querySelectorAll(".announcement-bar")[0];
if (AnnouncmentBar) {
var sticky = AnnouncmentBar.clientHeight;
function hideAnnoumentBar() {
  if (window.pageYOffset > sticky) {
      AnnouncmentBar.classList.add("hide");
  } else {
      AnnouncmentBar.classList.remove("hide");
  }
}
window.onscroll = function() {
  hideAnnoumentBar()
};
}


// Nav Bar //
const MainLink = document.querySelectorAll('.lavels-2');
MainLink.forEach(item => {
    item.addEventListener("mouseover", (event) => {
      item.closest('.header-content').classList.add('menu-active') 
    });
    item.addEventListener("mouseout", (event) => {
      item.closest('.header-content').classList.remove('menu-active')  
    });
});

const NavLink = document.querySelectorAll('.grand-menu-link');
NavLink.forEach(item => {
    item.addEventListener("mouseover", (event) => {
        var showimage = item.getAttribute('featured-image');
        const showimageItem = document.querySelectorAll('#' + showimage)[0];
        //console.log(showimageItem)  
      showimageItem.classList.add("active");
    });
    item.addEventListener("mouseout", (event) => {
        const hiddenImage = document.querySelectorAll('.featureImage');
        hiddenImage.forEach(menuItems => {
            menuItems.classList.remove("active");
        });
    });
});


// AddToCartItem //

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
                    html += '<div class="info-box"><h6>Added to cart</h6><p>' + varTitle + '</p></div>'
                    miniCart.innerHTML = html
                })
                document.body.classList.add('product-toast');
                setTimeout(() => {
                    document.body.classList.remove('product-toast');
                    miniCart.innerHTML = '';
                    if(document.body.classList.contains('template-cart')){
                      location.reload();
                    }else{
                      cartDrwer(); 
                    }
                }, '2000');
                
            }


        })

        .catch((error) => {
            console.error('Error:', error);
        });
}

// VariantSelector //

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
    //console.log(soldOut);
    var selectType = event.getAttribute('type')
    if (dataAvability == 'true') {
        if (selectType == "size") {
            //console.log(event)
            var checkClass = mainParent.classList.contains('product-page')
            if(checkClass){
              ManiProduct(mainParent, event, variantId)
            }else{
              addtocartitem(variantId)
            }
        }
    } else {
    }
}
function ManiProduct(element, event, variantId){
  const addToCartBtn = element.querySelector('.add-to-cart');
  const SizeValue = event.getAttribute('data-title');
  addToCartBtn.innerHTML = 'Add '+SizeValue+' To Bag';
  addToCartBtn.classList.add('EnabledButton');
  addToCartBtn.classList.add('primary-button');
  addToCartBtn.setAttribute('data-id',variantId);
  price_update(event,variantId);
}
function AddMainProduct(AddMainProduct) {
  const checkEnabled = AddMainProduct.classList.contains('EnabledButton');
  const vid = AddMainProduct.getAttribute('data-id')
  if(checkEnabled){
    addtocartitem(vid)
  }else{
    AddMainProduct.classList.remove('EnabledButton')
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
function price_update(event,variant_id){
  var mainParent = event.closest('.featured-product');
  var MainSelect = mainParent.querySelectorAll('select option');
  MainSelect.forEach(item => {
        var variant = item.value;
        if (variant === variant_id) {
            const variantId = item.value;
            const variantPrice = item.getAttribute('data-price');
            const variantComparePrice = item.getAttribute('data-compare');
            const PriceElement = mainParent.querySelectorAll('.regular_price');
            if(PriceElement){
              PriceElement.forEach(item => {
                item.innerHTML = Shopify.formatMoney(variantPrice)
              })
            }
            const CPElement = mainParent.querySelectorAll('.compare_at_price');
            if(CPElement){
              CPElement.forEach(item => {
                item.innerHTML = Shopify.formatMoney(variantComparePrice)
              })
            }
        }
    })
  
}
function ChnageVaiantImg(event) {
    var mainParent = event.closest('.featured-product');
    var checkClass = mainParent.classList.contains('product-page')
    var SizeSelectorOption = mainParent.querySelectorAll('.size-selector');
    //console.log(SizeSelectorOption);
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
    mainDiv.classList.add("swiper");
    var newDiv = document.createElement('div');
    newDiv.classList.add("swiper-wrapper");
    JsonScript.forEach(images => {
        if (selcterValue === images.alt) {
            var swiperWrapp = document.createElement('div');
            swiperWrapp.classList.add('swiper-slide')
            swiperWrapp.setAttribute("data-swiper-autoplay", "1000");
            if(checkClass){
            swiperWrapp.innerHTML = '<div class="swiper-zoom-container"><img class="borrder-all radius-20 feature-image" alt="'+ images.alt +'" src="' + images.src + '"></div>'
            }else{
            swiperWrapp.innerHTML = '<a href="' + prductUrl + '"><img class="borrder-all radius-20 feature-image" alt="'+ images.alt +'" src="' + images.src + '"></a>'
            }
            newDiv.appendChild(swiperWrapp);
        }
    })
    var swiperPrev = document.createElement('div');
    var swiperPage = document.createElement('div');
    swiperPage.classList.add('swiper-pagination')
    swiperPrev.classList.add('swiper-button-prev');
    swiperPrev.classList.add('secondary-button');
    var swiperNext = document.createElement('div');
    swiperNext.classList.add('swiper-button-next');
    swiperNext.classList.add('secondary-button')
    var htmlstring = newDiv.innerHTML
    htmlstring = (htmlstring.trim) ? htmlstring.trim() : htmlstring.replace(/^\s+/,'');
    if(htmlstring == '') {
    JsonScript.forEach(images => {
            var swiperWrapp = document.createElement('div');
            swiperWrapp.classList.add('swiper-slide')
            swiperWrapp.setAttribute("data-swiper-autoplay", "1000");
            if(checkClass){
              swiperWrapp.innerHTML = '<div class="swiper-zoom-container"><img class="borrder-all radius-20 feature-image" alt="'+ images.alt +'" src="' + images.src + '"></div>'
            }else{
             swiperWrapp.innerHTML = '<a href="' + prductUrl + '"><img class="borrder-all radius-20 feature-image" alt="'+ images.alt +'" src="' + images.src + '"></a>'
             }
            newDiv.appendChild(swiperWrapp);
    })
     mainDiv.append(newDiv)
    }else{
    mainDiv.append(newDiv)
    }
    mainDiv.append(swiperNext)
    mainDiv.append(swiperPrev);
    if(checkClass){
      mainDiv.append(swiperPage);
    }
    topcontainer.appendChild(mainDiv)
    // intilize slider
    var item = mainParent.querySelectorAll('.product-image-slide')[0];
    var newElem = mainParent.querySelectorAll('.product-image-slide')[0]
    var nextbutton = newElem.querySelectorAll('.swiper-button-next')[0];
    var prebutton = newElem.querySelectorAll('.swiper-button-prev')[0];
    
            if(checkClass){
              var swiperPagination = newElem.querySelectorAll('.swiper-pagination')[0];
              const swiperTabs = new Swiper(item, {
                loop: true,
                zoom: true,
                slidesPerView: 1,
                navigation: {
                    nextEl: nextbutton,
                    prevEl: prebutton,
                },
                pagination: {
                  el: swiperPagination,
                  clickable: true,
                },
                breakpoints: {
                    640: {
                        slidesPerView: 1,
                    },
                    1024: {
                        slidesPerView: 1,
                    },
                    1366: {
                        effect: 'fade',
                        slidesPerView: 1,
            
                    },
                },
            })
            }else{
              const swiperTabs = new Swiper(item, {
                loop: true,
                allowTouchMove: false,
                autoplay: 7000,
                speed: 300,
                slidesPerView: 1,
                autoHeight: true,
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
            }
    
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
      console.log(soldOut);	
        soldOut.forEach(sold => {	
            var soldItem = mainParent.querySelectorAll('.size-selector[data-title="' + sold + '"]')[0];	
            soldItem.innerHTML += '<svg onclick="notify(this)" class="svgSold" data-name="Bell Icon" xmlns="http://www.w3.org/2000/svg" role="presentation" viewBox="0 0 448 512" class="icon-bell h-[15px] px-[5px] fill-secondary"><path d="M256 32V51.2C329 66.03 384 130.6 384 208V226.8C384 273.9 401.3 319.2 432.5 354.4L439.9 362.7C448.3 372.2 450.4 385.6 445.2 397.1C440 408.6 428.6 416 416 416H32C19.4 416 7.971 408.6 2.809 397.1C-2.353 385.6-.2883 372.2 8.084 362.7L15.5 354.4C46.74 319.2 64 273.9 64 226.8V208C64 130.6 118.1 66.03 192 51.2V32C192 14.33 206.3 0 224 0C241.7 0 256 14.33 256 32H256zM224 512C207 512 190.7 505.3 178.7 493.3C166.7 481.3 160 464.1 160 448H288C288 464.1 281.3 481.3 269.3 493.3C257.3 505.3 240.1 512 224 512z"></path></svg>';	
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

var productGridImageSlider = document.querySelectorAll('.product-image-wrapper');
productGridImageSlider.forEach(item => {
    var newElem = item.closest('.product-image-container')
    var nextbutton = newElem.querySelectorAll('.swiper-button-next')[0];
    var prebutton = newElem.querySelectorAll('.swiper-button-prev')[0];
    const swiperTabs = new Swiper(item, {
        allowTouchMove: false,
        loop: true,
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
        breakpoints: {
          640: {
              spaceBetween: 15,
              slidesPerView: 1,
          },
          1024: {
              slidesPerView: 1,
          },
          1366: {
              slidesPerView: 1,
  
          },
      },
    })
})
// notify me 
function notify(item) {
  alert("YEe")
}
// Look The Shop
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
function openShopLookProduct(item){
  const m_fixed = item.closest('.shoplock-slider');
    m_fixed.classList.add('m_fixed');
}
function removemfixed(item) {
    const m_fixed = item.closest('.shoplock-slider');
    m_fixed.classList.remove('m_fixed');
}

// search box function 
function getSearchBox(){
  var SearchBox = document.getElementById('quick_search_box');
  const checkAdded = SearchBox.classList.contains('updated-data');
  if(checkAdded == false){
    fetch(window.Shopify.routes.search + "?section_id=quick-search")
        .then(response => response.text())
        .then((responseText) => {
            const parsedHTML = new DOMParser().parseFromString(responseText, 'text/html').getElementById('shopify-section-quick-search').innerHTML;
            var container = document.createElement("div");
            document.getElementById('quick_search_box').innerHTML = parsedHTML;
            document.getElementById('quick_search_box').classList.add('updated-data');
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
             setTimeout(() => {
              document.body.classList.add('modal-search-open');
            },200);
        })
  }else{
    document.body.classList.add('modal-search-open');
  }
  
}
openModal = (event) => {
  getSearchBox()  
}
hideModal = (event) => {
    document.body.classList.remove('modal-search-open');
}
var seachTrigger = document.querySelectorAll('#SeachTrigger')[0];
seachTrigger.addEventListener('click', event => {
    openModal(event)
})
function getSearchResult(searchTerm) {
    const searchTermValue = searchTerm.value.trim();
    if(searchTermValue.length >= 3){
    fetch(`/search/suggest?q=${searchTermValue}&section_id=quick-search`)
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          throw error;
        }
        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#predictive-search-results').innerHTML
          document.getElementById('predictive-search').innerHTML = parsedHTML = resultsMarkup;
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
        if(searchTermValue.size > 0){
          document.getElementById('predictive-search').classList.add('active')
        }
        
      })
      .catch((error) => {
        throw error;
      });
    document.getElementById('predictive-search').classList.add('active')
      
    }else{
      document.getElementById('predictive-search').classList.remove('active')
    }
    
  }

// Menu box function
menuOpen = (event) => {
    document.body.classList.add('modal-menu-open');
    var firstmenu = document.querySelectorAll('li.menu-link.has-child-links')[0];
    firstmenu.classList.add('active')
}
menuClose = (event) => {
    document.body.classList.remove('modal-menu-open');
}
function TabContent(TabContent) {
  const CollectionHandle = TabContent.getAttribute('data-collection');
  const ProductTotal = TabContent.getAttribute('data-total');
  const PreRow = TabContent.getAttribute('data-row');
  const Heading = TabContent.getAttribute('data-heading');
  const SubHeading = TabContent.getAttribute('data-sub');
  const ButtonText = TabContent.getAttribute('data-button');
  const TabTitle = TabContent.getAttribute('data-title');
  const ParentDiv = TabContent.closest('.CarsoulBox');
  var SliderDiv = ParentDiv.querySelector('.TabProductBox');
  const change_heading_element = ParentDiv.querySelector('.heading_title');
  const change_sub_heading_element = ParentDiv.querySelector('.sub_title');
  const show_button = ParentDiv.querySelector('.RightSide');
  const TabLink = ParentDiv.querySelectorAll('.tablinks');
  const TabDirection = ParentDiv.querySelector('.tabs__nav-decoration');
  
  if(Heading != 'NULL'){
    change_heading_element.classList.remove('hide');
    change_heading_element.style.opacity = "0";
    change_heading_element.classList.add('fadein')
    setTimeout(() => {
    change_heading_element.innerHTML = Heading;
    change_heading_element.style.opacity = "1";
    },300)
  }else{
    change_heading_element.classList.add('hide')
  }
  if(SubHeading != 'NULL'){
    change_sub_heading_element.style.opacity = "0";
    change_sub_heading_element.classList.remove('hide');
    change_sub_heading_element.classList.add('fadein')
    setTimeout(() => {
    change_sub_heading_element.innerHTML = SubHeading;
    change_sub_heading_element.style.opacity = "1";
    },300)
  }else{
    change_sub_heading_element.classList.add('hide')
  }
  if(ButtonText != 'NULL'){
    show_button.style.opacity = "0";
    show_button.classList.remove('hide');
    show_button.classList.add('fadein')
    const html = '<a href="'+CollectionHandle+'"class="cta-btn primary-button">'+ButtonText+'</a>';
    setTimeout(() => {
    show_button.innerHTML = html;
    show_button.style.opacity = "1";
    },300)
  }else{
    show_button.classList.add('hide')
  }
  
   console.log(TabContent.classList.contains('active'))
   if(TabContent.classList.contains('active')){
     
   }else{
   SliderDiv.classList.add('loading-effect');
   fetch("/collections/"+CollectionHandle+"?section_id=collection-data")
        .then(response => response.text())
        .then((responseText) => {
            const parsedHTML = new DOMParser().parseFromString(responseText, 'text/html').getElementById('shopify-section-collection-data');
            let gridItem = parsedHTML.querySelectorAll('.GridData');
            var mainDiv = document.createElement('div');
            mainDiv.classList.add("collection-list");
            mainDiv.classList.add("swiper");
            var newDiv = document.createElement('div');
            newDiv.classList.add("swiper-wrapper");
            //console.log(gridItem.length)
            gridItem.forEach(function (item, i) {
              if (i < ProductTotal) {
                  var swiperWrapp = document.createElement('div');
                  swiperWrapp.classList.add('swiper-slide')
                  swiperWrapp.innerHTML = item.innerHTML;
                  newDiv.appendChild(swiperWrapp);
              }
              if (i === gridItem.length - 1){ 
                mainDiv.append(newDiv);
                var swiperPrev = document.createElement('div');
                swiperPrev.classList.add('swiper-button-prev');
                swiperPrev.classList.add('swiper-prev');
                swiperPrev.classList.add('tabingPrev');
                swiperPrev.classList.add('secondary-button');
                var swiperNext = document.createElement('div');
                swiperNext.classList.add('swiper-button-next');
                swiperNext.classList.add('swiper-next');
                swiperNext.classList.add('tabingNext');
                swiperNext.classList.add('secondary-button')
                mainDiv.appendChild(swiperPrev);
                mainDiv.appendChild(swiperNext)
              }
            })
            SliderDiv.innerHTML = ''
            SliderDiv.appendChild(mainDiv);
            var item = ParentDiv.querySelectorAll('.collection-list')[0];
            var nextbutton = ParentDiv.querySelectorAll('.tabingNext')[0];
            var prebutton = ParentDiv.querySelectorAll('.tabingPrev')[0];
            //console.log(nextbutton)
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
                    slidesPerView: PreRow,
          
                },
            },
          })
          var collcetionImageSlider = document.querySelectorAll('.product-image-wrapper');
            collcetionImageSlider.forEach(item => {
                //console.log(item)
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
            setTimeout(() => {
            SliderDiv.classList.remove('loading-effect');
            },1000)
        })
   }
   var LeftValue = 3;
    TabLink.forEach(function (item, i) {
          item.classList.remove('active')
          const title = item.getAttribute('data-title');
          const widthValue = parseInt(item.offsetWidth);
          LeftValue += widthValue;
         if(TabTitle == title){
          //console.log("left: "+LeftValue)
          const CurrentWidth = item.offsetWidth; 
          let Updated = LeftValue - item.offsetWidth;
          if(Updated == 0){
            Updated = 3;
          }
           //console.log(Updated)
           TabDirection.style.width = CurrentWidth+'px';
           TabDirection.style.left = Updated+'px';
         } 
     })
   TabContent.classList.add('active');  
}
function quick_view(event) {
  var mainParent = event.closest('.featured-product');
  var URL = mainParent.querySelector('.top-container').getAttribute('data-url');
  console.log(URL)
  fetch(URL)
        .then(response => response.text())
        .then((responseText) => {
            //var parsedHTML = new DOMParser().parseFromString(responseText, 'text/html').getElementById('ProductBox').innerHTML;
            var ImageBox = new DOMParser().parseFromString(responseText, 'text/html').getElementById("MainSliderBox").innerHTML;
            var ContantBox = new DOMParser().parseFromString(responseText, 'text/html').getElementById("ProductContent").innerHTML;
            var ImageBoxDiv = document.createElement("div");
            ImageBoxDiv.setAttribute("id", "MainSliderBox");
            ImageBoxDiv.innerHTML = ImageBox;
            var ContantBoxDiv = document.createElement("div");
            ContantBoxDiv.setAttribute("id", "ProductContent");
            ContantBoxDiv.innerHTML = ContantBox;
            var container = document.createElement("div");
            container.classList.add('featured-product');
            container.classList.add('product-page');
            container.appendChild(ImageBoxDiv);
            container.appendChild(ContantBoxDiv);
            document.getElementById('quick-product-view').innerHTML = ""
            document.getElementById('quick-product-view').appendChild(container);
            
            var productGridImageSlider = document.querySelectorAll('.product-image-wrapper');
            productGridImageSlider.forEach(item => {
                var newElem = item.closest('.product-image-container')
                var nextbutton = newElem.querySelectorAll('.swiper-button-next')[0];
                var prebutton = newElem.querySelectorAll('.swiper-button-prev')[0];
                const swiperTabs = new Swiper(item, {
                    allowTouchMove: false,
                    loop: true,
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
            });
            
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
          document.body.classList.add('open-quick-view');
        })
  
            
}
function quick_view_close(event) {
 document.body.classList.remove('open-quick-view')
}

function TabsTrigger(ProductTabs) {
 const parentDiv = ProductTabs.closest('.ProductTabs');
 const row = ProductTabs.closest('.TabListContainer');
 if(row.classList.contains('active')){
   row.classList.remove('active')
 }else{
    const AllRow = parentDiv.querySelectorAll('.TabListContainer')
  AllRow.forEach(function (item, i) {
    if(i !== 0){
      item.classList.remove('active');
    }
  })
  row.classList.add('active')
 }

}

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
/* Size Guide Popup */
function size_guide_close(size_guide_close) {
  document.body.classList.remove('size-guide-open')
}
function UpdateProductGrid(even, url) {
  
}
function ClearAllFilter(ClearAllFilter) {
  
}
function size_guide_open(size_guide_open) {
  const url = size_guide_open.getAttribute('data-url')
  console.log(url)
  fetch(url)
        .then(response => response.text())
        .then((responseText) => {
            
            var PageContent = new DOMParser().parseFromString(responseText, 'text/html').getElementById("PageContent").innerHTML;
            var container = document.createElement("div");
            container.innerHTML = PageContent;
            document.getElementById('size_guide').innerHTML = ""
            document.getElementById('size_guide').appendChild(container);
            document.body.classList.add('size-guide-open')
        })
}