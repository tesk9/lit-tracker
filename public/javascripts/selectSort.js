var selectSort = function(arr) {
  return _select(arr, 0)
}

var _select = function(arr, index) {
  var checker = arr.slice(index, arr.length);
  var min = Math.min.apply(null, checker);
  var indMin = checker.indexOf(min) + index;

  var switchStore = arr[index];
  arr[index] = min;
  arr[indMin] = switchStore;

  if(arr.length > index+1) {
    return _select(arr, index+1);
  } else {
      return arr;
  }

}

selectSort([12,1,2,3,14,5,3]);