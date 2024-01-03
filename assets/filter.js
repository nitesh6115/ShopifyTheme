var height = document.querySelector('.CollectionFilters').offsetHeight;
function FilterOpen(FilterLabel) {
  let Parent = FilterLabel.closest('.CollectionFilters');
  const FilterItme = FilterLabel.closest('.FilterItem');
  const FilterItmeValues = FilterItme.querySelector('.FilterValues');
  const childHeight = FilterItmeValues.offsetHeight;
  const changeHeight = height+childHeight;
  console.log(changeHeight)
  const AllFilterLabel = Parent.querySelectorAll('.FilterItem');
  if(FilterLabel.classList.contains('active')){
    FilterLabel.closest('.FilterItem').classList.remove('active');
    Parent.style.height = height+'px';
  }else{
    
    AllFilterLabel.forEach(label =>{
    label.classList.remove('active');
    Parent.style.height = height+'px';
  })
  FilterLabel.closest('.FilterItem').classList.add('active')
  Parent.style.height = changeHeight+'px';
  }
  
}