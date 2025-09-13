// Search algorithms - pure functions that return step-by-step animations
export const linearSearchSteps = (array, target, startIndex = 0) => {
  const steps = [];
  let stepCounter = 1;
  
  steps.push({
    type: 'initialize',
    array: [...array],
    target,
    currentIndex: null,
    searchRange: { start: startIndex, end: array.length - 1 },
    message: `Starting linear search for ${target}`,
    highlight: `Searching through ${array.length - startIndex} elements sequentially`,
    description: `Linear search checks each element one by one from left to right`,
    stepNumber: stepCounter++
  });
  
  for (let i = startIndex; i < array.length; i++) {
    steps.push({
      type: 'examine',
      array: [...array],
      target,
      currentIndex: i,
      searchRange: { start: startIndex, end: array.length - 1 },
      value: array[i],
      message: `Examining element at index ${i}`,
      highlight: `Current element: ${array[i]}`,
      description: `Checking if ${array[i]} equals target ${target}`,
      stepNumber: stepCounter++
    });
    
    steps.push({
      type: 'compare',
      array: [...array],
      target,
      currentIndex: i,
      searchRange: { start: startIndex, end: array.length - 1 },
      value: array[i],
      isMatch: array[i] === target,
      message: `Comparing: ${array[i]} ${array[i] === target ? '==' : '!='} ${target}`,
      highlight: array[i] === target ? 'Match found!' : `No match, continue searching`,
      description: array[i] === target ? `Target found at position ${i}` : `${array[i]} is not equal to ${target}, move to next element`,
      stepNumber: stepCounter++
    });
    
    if (array[i] === target) {
      steps.push({
        type: 'found',
        array: [...array],
        target,
        foundIndex: i,
        searchRange: { start: startIndex, end: array.length - 1 },
        comparisons: i - startIndex + 1,
        message: `Target ${target} found at index ${i}`,
        highlight: `Search completed successfully in ${i - startIndex + 1} comparison(s)`,
        description: `Linear search found the target after examining ${i - startIndex + 1} elements`,
        stepNumber: stepCounter++
      });
      return steps;
    }
  }
  
  steps.push({
    type: 'not-found',
    array: [...array],
    target,
    currentIndex: null,
    searchRange: { start: startIndex, end: array.length - 1 },
    comparisons: array.length - startIndex,
    message: `Target ${target} not found in array`,
    highlight: `Searched all ${array.length - startIndex} elements without finding target`,
    description: `Linear search completed after ${array.length - startIndex} comparisons with no match`,
    stepNumber: stepCounter++
  });
  
  return steps;
};

export const binarySearchSteps = (array, target) => {
  const steps = [];
  let left = 0;
  let right = array.length - 1;
  let stepCounter = 1;
  let comparisons = 0;
  
  steps.push({
    type: 'initialize',
    array: [...array],
    target,
    searchRange: { left, right },
    mid: null,
    message: `Starting binary search for ${target}`,
    highlight: `Binary search requires sorted array - range [${left}, ${right}]`,
    description: `Binary search eliminates half the search space in each step`,
    stepNumber: stepCounter++
  });
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    steps.push({
      type: 'calculate-mid',
      array: [...array],
      target,
      searchRange: { left, right },
      mid,
      calculation: `floor((${left} + ${right}) / 2)`,
      message: `Calculating midpoint: floor((${left} + ${right}) / 2) = ${mid}`,
      highlight: `Midpoint at index ${mid} divides search range`,
      description: `Binary search always checks the middle element of current range`,
      stepNumber: stepCounter++
    });
    
    steps.push({
      type: 'examine-mid',
      array: [...array],
      target,
      searchRange: { left, right },
      mid,
      value: array[mid],
      message: `Examining middle element: array[${mid}] = ${array[mid]}`,
      highlight: `Comparing ${array[mid]} with target ${target}`,
      description: `This comparison will determine which half to search next`,
      stepNumber: stepCounter++
    });
    
    comparisons++;
    const comparison = array[mid] === target ? 'equal' : array[mid] < target ? 'less' : 'greater';
    
    steps.push({
      type: 'compare',
      array: [...array],
      target,
      searchRange: { left, right },
      mid,
      value: array[mid],
      comparison,
      isMatch: array[mid] === target,
      message: `Comparison: ${array[mid]} ${array[mid] === target ? '==' : array[mid] < target ? '<' : '>'} ${target}`,
      highlight: array[mid] === target ? 'Target found!' : array[mid] < target ? 'Target is in right half' : 'Target is in left half',
      description: array[mid] === target ? `Perfect match at index ${mid}` : array[mid] < target ? `${array[mid]} < ${target}, so target must be in right half` : `${array[mid]} > ${target}, so target must be in left half`,
      stepNumber: stepCounter++
    });
    
    if (array[mid] === target) {
      steps.push({
        type: 'found',
        array: [...array],
        target,
        foundIndex: mid,
        searchRange: { left, right },
        comparisons,
        message: `Target ${target} found at index ${mid}`,
        highlight: `Binary search completed successfully in ${comparisons} comparison(s)`,
        description: `Binary search is highly efficient: O(log n) time complexity`,
        stepNumber: stepCounter++
      });
      return steps;
    } else if (array[mid] < target) {
      left = mid + 1;
      steps.push({
        type: 'search-right',
        array: [...array],
        target,
        searchRange: { left, right },
        previousMid: mid,
        eliminated: { start: 0, end: mid },
        message: `Eliminating left half: searching range [${left}, ${right}]`,
        highlight: `Discarded ${mid + 1} elements from left half`,
        description: `Since ${array[mid]} < ${target}, target cannot be in left half`,
        stepNumber: stepCounter++
      });
    } else {
      right = mid - 1;
      steps.push({
        type: 'search-left',
        array: [...array],
        target,
        searchRange: { left, right },
        previousMid: mid,
        eliminated: { start: mid, end: array.length - 1 },
        message: `Eliminating right half: searching range [${left}, ${right}]`,
        highlight: `Discarded ${array.length - mid} elements from right half`,
        description: `Since ${array[mid]} > ${target}, target cannot be in right half`,
        stepNumber: stepCounter++
      });
    }
  }
  
  steps.push({
    type: 'not-found',
    array: [...array],
    target,
    searchRange: { left, right },
    comparisons,
    message: `Target ${target} not found in array`,
    highlight: `Binary search completed in ${comparisons} comparison(s) - target not present`,
    description: `Search space exhausted: left (${left}) > right (${right})`,
    stepNumber: stepCounter++
  });
  
  return steps;
};