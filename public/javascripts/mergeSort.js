var merge = function(left, right) {
  var indL = 0, indR = 0, arr = [];
//   console.log("Left and Right Length: "+ (left.length + right.length));

  while(arr.length < (left.length + right.length)) {
    if((left[indL] < right[indR])) {
      arr.push(left[indL]);
      indL++;
    } else if((left[indL] >= right[indR]) ) {
      arr.push(right[indR]);
      indR++;
    } else if(left[indL] === undefined) {
      arr.push(right[indR]);
      indR++;
    } else if(right[indR] === undefined) {
      arr.push(left[indL]);
      indL++;      
    }
  }
  return arr;
}

var mergeSort = function(arr) {
  if(arr.length == 1) {
    return arr;
  }

  var mid = Math.floor(arr.length / 2);
  var left = mergeSort(arr.slice(0, mid)) || [];
  var right = mergeSort(arr.slice(mid, arr.length)) || [];

  return merge(left, right)
}

console.log(split([3,2,1,4,5,7]))