function mouseLive(){
  let element = document.querySelectorAll('.CollectionFilters'); 
  element.forEach(elementItem =>{
    elementItem.addEventListener('mouseleave', function (e) {
       var AllFilterLabel = document.querySelectorAll('.FilterItem');
        let height = document.querySelector('.CollectionFilterBox').offsetHeight;
        let ClearFilterDivHeight = document.querySelector('.FilterResults').offsetHeight;
        height = height+ClearFilterDivHeight;
       let Parent = elementItem.closest('.CollectionFilters');
        AllFilterLabel.forEach(item =>{
          item.classList.remove('active');
      })
       Parent.style.height = height+'px';
    })
  })
}
mouseLive()
function filtelOpen(params) {
  if( document.body.classList.contains('filter-open')){
     document.body.classList.remove('filter-open')
  }else{
    document.body.classList.add('filter-open')
  }
}
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
            var PriceRangeSlider = document.getElementById('PriceRange');
            if(PriceRangeSlider){
                slideOne();
                slideTwo();
            }
            mouseLive()
            var openTrigger = UpdateDiv.querySelectorAll('.FilterItem')[event];
            var element = openTrigger.querySelector('.FilterLabel')
              if(element){
                element.click()
              }
        })
    document.body.classList.add('filter-open')
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


/* Price filter */
var PriceRangeSlider = document.getElementById("PriceRange");
window.onload = function () {
if(PriceRangeSlider){
  slideOne();
  slideTwo();
}
};
var minGap = 2;
var sliderMaxValue = document.getElementById("MinInput").max;
var CurrencySymbol = PriceRangeSlider.getAttribute('data-currency');

function fillColor() {
  var sliderOne = document.getElementById("MinInput");
  var sliderTwo = document.getElementById("MaxInput");
  var sliderTrack = document.getElementById("RangeTrack");
  var displayValOne = document.getElementById("range1");
  var displayValTwo = document.getElementById("range2");
  percent1 = (sliderOne.value / sliderMaxValue) * 100;
  percent2 = (sliderTwo.value / sliderMaxValue) * 100;
  displayValOne.style.left = percent1-5+'%';
  displayValTwo.style.left = percent2-7+'%';
  sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`; 
}
function slideOne() {
  var sliderOne = document.getElementById("MinInput");
  var sliderTwo = document.getElementById("MaxInput");
  var displayValOne = document.getElementById("range1");
  if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
    sliderOne.value = parseInt(sliderTwo.value) - minGap;
  }
  displayValOne.innerHTML = '';
  displayValOne.innerHTML = CurrencySymbol+' '+sliderOne.value;
  fillColor();
}
function slideTwo() {
  var sliderOne = document.getElementById("MinInput");
  var sliderTwo = document.getElementById("MaxInput");
  var displayValTwo = document.getElementById("range2");
  if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
    sliderTwo.value = parseInt(sliderOne.value) + minGap;
  }
  displayValTwo.innerHTML = '';
  displayValTwo.innerHTML = CurrencySymbol+' '+sliderTwo.value;
  fillColor();
}


