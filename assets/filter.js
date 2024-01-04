
function FilterOpen(FilterLabel) {
  let height = document.querySelector('.CollectionFilterBox').offsetHeight;
  let ClearFilterDivHeight = document.querySelector('.FilterResults').offsetHeight;
  height = height+ClearFilterDivHeight;
  let Parent = FilterLabel.closest('.CollectionFilters');
  const FilterItme = FilterLabel.closest('.FilterItem');
  const FilterItmeValues = FilterItme.querySelector('.FilterValues');
  const childHeight = FilterItmeValues.offsetHeight;
  const changeHeight = height+childHeight;
  console.log(changeHeight)
  var AllFilterLabel = Parent.querySelectorAll('.FilterItem');
  if(FilterItme.classList.contains('active')){
    console.log(FilterLabel)
    FilterLabel.closest('.FilterItem').classList.remove('active');
    Parent.style.height = height+'px';
  }else{
    AllFilterLabel.forEach(item =>{
    item.classList.remove('active');
    Parent.style.height = height+'px';
  })
  FilterLabel.closest('.FilterItem').classList.add('active')
  Parent.style.height = changeHeight+'px';
  }
  
}

function UpdatProductGrid(url,event) {
  const URL = url;
  fetch(URL)
        .then(response => response.text())
        .then((responseText) => {
            
            var PageContent = new DOMParser().parseFromString(responseText, 'text/html').getElementById("CollectionProductGrid").innerHTML;
            var container = document.createElement("div");
            container.innerHTML = PageContent;
            var UpdateDiv = document.getElementById('CollectionProductGrid');
            UpdateDiv.innerHTML = '';
            UpdateDiv.appendChild(container);
            window.history.pushState(URL,'',URL)
            var collcetionImageSlider = UpdateDiv.querySelectorAll('.product-image-wrapper');
            console.log(event)
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
            var variantImages = UpdateDiv.querySelectorAll('.prodouct-variant-slider');
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
            var openTrigger = UpdateDiv.querySelectorAll('.FilterItem')[event];
            var element = openTrigger.querySelector('.FilterLabel')
              if(element){
                element.click()
              }
        })
}

function filter_data (item,event) {
  const form = item.closest("#FilterForm");
  const Handle = form.getAttribute('collection-handle');
  const queryString = new URLSearchParams(new FormData(form)).toString()
  const URL = Handle+'?'+queryString;
  const GetChild = item.closest('.FilterItem');
  var parent = GetChild.parentNode;
  var ChildIndex = Array.prototype.indexOf.call(parent.children, GetChild)
  console.log(ChildIndex)
  UpdatProductGrid(URL,ChildIndex)
}
function sortBy(item,event) {
  const form = item.closest("#FilterForm");
  const Handle = form.getAttribute('collection-handle');
  const queryString = new URLSearchParams(new FormData(form)).toString()
  const URL = Handle+'?'+queryString;
  const GetChild = item.closest('.FilterItem');
  var parent = GetChild.parentNode;
  var ChildIndex = Array.prototype.indexOf.call(parent.children, GetChild)
  console.log(ChildIndex)
  UpdatProductGrid(URL,ChildIndex)
}
function sortByChange(item,event) {
  const value = item.getAttribute('data-value');
  let SortBox = document.getElementById('SortBy');
  SortBox.value = value;
  SortBox.dispatchEvent(new Event('change'))
  
}
function removeFilter(item,event) {
  const URL = item.getAttribute('data-href');
  console.log(URL)
  UpdatProductGrid(URL,event)
}

window.onload = function () {
  slideOne();
  slideTwo();
};
var PriceRangeSlider = document.getElementById("PriceRange");

let sliderOne = PriceRangeSlider.querySelector(".FirstPoint");
let sliderTwo = PriceRangeSlider.querySelector(".LastPoint");
let displayValOne = PriceRangeSlider.querySelector("#range1");
let displayValTwo = PriceRangeSlider.querySelector("#range2");

let minGap = 2;
let sliderTrack = PriceRangeSlider.querySelector(".slider-track");
let sliderMaxValue = PriceRangeSlider.querySelector(".FirstPoint").max;
let CurrencySymbol = PriceRangeSlider.getAttribute('data-currency');
function slideOne() {
  if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
    sliderOne.value = parseInt(sliderTwo.value) - minGap;
  }
  displayValOne.textContent = CurrencySymbol+' '+sliderOne.value;
  fillColor();
}
function slideTwo() {
  if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
    sliderTwo.value = parseInt(sliderOne.value) + minGap;
  }
  displayValTwo.textContent = CurrencySymbol+' '+sliderTwo.value;
  fillColor();
}
function fillColor() {
  percent1 = (sliderOne.value / sliderMaxValue) * 100;
  percent2 = (sliderTwo.value / sliderMaxValue) * 100;
  const displayOneWidth = displayValOne.offsetWidth / 2;
  const displayTwoWidth = displayValTwo.offsetWidth / 2;
  console.log(displayOneWidth)
  displayValOne.style.left = percent1-displayOneWidth+'%';
  displayValTwo.style.left = percent2-displayTwoWidth+'%';
  sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
}

