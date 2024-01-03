var height = document.querySelector('.CollectionFilters').offsetHeight;
function FilterOpen(FilterLabel) {
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
function filter_data (item) {
  const form = item.closest("#FilterForm");
  const Handle = form.getAttribute('collection-handle');
  const queryString = new URLSearchParams(new FormData(form)).toString()
  const URL = Handle+'?'+queryString;
  fetch(URL)
        .then(response => response.text())
        .then((responseText) => {
            
            var PageContent = new DOMParser().parseFromString(responseText, 'text/html').getElementById("CollectionProductGrid").innerHTML;
            var container = document.createElement("div");
            container.innerHTML = PageContent;
            var UpdateDiv = document.getElementById('CollectionProductGrid');
            UpdateDiv.innerHTML = '';
            UpdateDiv.appendChild(container);

        })
  
  
}