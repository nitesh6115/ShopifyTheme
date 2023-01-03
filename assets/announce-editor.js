 document.addEventListener('shopify:block:select', function(event) {
var flkty = new Flickity( '.announce-slider{{ section.id }}', {
 prevNextButtons: false,
 pageDots: false,
 autoPlay: true,
fullscreen: true
});
});
document.addEventListener('shopify:block:deselect', function(event) {
var elem = document.querySelector('.announce-slider{{ section.id }}')[0];
  elem.Flickity('destroy');  
});

//  section load===============
document.addEventListener('shopify:section:load', function(event) {
var flkty = new Flickity( '.announce-slider{{ section.id }}', {
 prevNextButtons: false,
 pageDots: false,
 autoPlay: true,
fullscreen: true
  
});
});

document.addEventListener('shopify:section:unload', function(event) {
var elem = document.querySelector('.announce-slider{{ section.id }}')[0];
 elem.Flickity('destroy'); 
});