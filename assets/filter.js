function FilterOpen(FilterLabel) {
  let Parent = FilterLabel.closest('.CollectionFilterBox');
  const height = Parent.offsetHeight;
  const FilterItme = FilterLabel.closest('.FilterItem');
  const FilterItmeValues = FilterItme.querySelector('.FilterValues');
  const childHeight = FilterItmeValues.offsetHeight;
  const changeHeight = height+childHeight;
  const AllFilterLabel = Parent.querySelectorAll('.FilterItem');
  if(FilterLabel.classList.contains('active')){
    FilterLabel.closest('.FilterItem').classList.remove('active');
    Parent.style.height = height;
  }else{
    AllFilterLabel.forEach(label =>{
    label.classList.remove('active')
  })
  FilterLabel.closest('.FilterItem').classList.add('active')
  Parent.style.height = changeHeight;
  }
  
}