// Sorting algorithms - pure functions that return step-by-step animations
export const bubbleSortSteps = (arr) => {
  const steps = [];
  const result = [...arr];
  let stepCounter = 1;
  
  // Add initial state
  steps.push({
    type: 'initialize',
    array: [...result],
    comparing: [],
    swapping: [],
    sorted: [],
    message: `Starting Bubble Sort with array [${result.join(', ')}]`,
    highlight: `Initial array - will bubble largest elements to the right`,
    description: `Bubble Sort compares adjacent elements and swaps them if they're in wrong order`,
    stepNumber: stepCounter++
  });
  
  for (let i = 0; i < result.length - 1; i++) {
    steps.push({
      type: 'pass-start',
      array: [...result],
      comparing: [],
      swapping: [],
      sorted: Array.from({length: i}, (_, idx) => result.length - 1 - idx),
      message: `Starting pass ${i + 1}`,
      highlight: `Pass ${i + 1}: Will find the ${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} largest element`,
      description: `Each pass bubbles the largest unsorted element to its correct position`,
      stepNumber: stepCounter++
    });
    
    for (let j = 0; j < result.length - i - 1; j++) {
      steps.push({
        type: 'compare',
        array: [...result],
        comparing: [j, j + 1],
        swapping: [],
        sorted: Array.from({length: i}, (_, idx) => result.length - 1 - idx),
        message: `Comparing ${result[j]} and ${result[j + 1]}`,
        highlight: `Step ${stepCounter}: Compare elements at positions ${j} and ${j + 1}`,
        description: `${result[j]} ${result[j] > result[j + 1] ? '>' : '≤'} ${result[j + 1]} - ${result[j] > result[j + 1] ? 'Need to swap' : 'No swap needed'}`,
        stepNumber: stepCounter++
      });
      
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        steps.push({
          type: 'swap',
          array: [...result],
          comparing: [],
          swapping: [j, j + 1],
          sorted: Array.from({length: i}, (_, idx) => result.length - 1 - idx),
          message: `Swapped ${result[j]} and ${result[j + 1]}`,
          highlight: `Swapping because ${result[j]} < ${result[j + 1]} (after swap)`,
          description: `Elements swapped - larger element moves right`,
          stepNumber: stepCounter++
        });
      }
    }
    
    steps.push({
      type: 'mark-sorted',
      array: [...result],
      comparing: [],
      swapping: [],
      sorted: Array.from({length: i + 1}, (_, idx) => result.length - 1 - idx),
      message: `Element ${result[result.length - 1 - i]} is now in its final position`,
      highlight: `Pass ${i + 1} complete. Largest element bubbled to position ${result.length - 1 - i}`,
      description: `Position ${result.length - 1 - i} is now sorted with value ${result[result.length - 1 - i]}`,
      stepNumber: stepCounter++
    });
  }
  
  // Final step
  steps.push({
    type: 'complete',
    array: [...result],
    comparing: [],
    swapping: [],
    sorted: Array.from({length: result.length}, (_, idx) => idx),
    message: `Bubble Sort completed! Array is now sorted.`,
    highlight: `Final result: [${result.join(', ')}]`,
    description: `All elements are now in ascending order`,
    stepNumber: stepCounter++
  });
  
  return steps;
};

export const selectionSortSteps = (arr) => {
  const steps = [];
  const result = [...arr];
  let stepCounter = 1;
  
  steps.push({
    type: 'initialize',
    array: [...result],
    comparing: [],
    swapping: [],
    sorted: [],
    currentPass: 0,
    minIndex: null,
    message: `Starting Selection Sort on array of ${arr.length} elements`,
    highlight: `Selection sort finds the minimum element and places it at the beginning`,
    description: `Selection sort repeatedly finds the minimum element from unsorted portion`,
    stepNumber: stepCounter++
  });
  
  for (let i = 0; i < result.length - 1; i++) {
    let minIndex = i;
    
    steps.push({
      type: 'pass-start',
      array: [...result],
      comparing: [],
      swapping: [],
      sorted: Array.from({length: i}, (_, idx) => idx),
      currentPass: i + 1,
      minIndex: i,
      searchRange: [i, result.length - 1],
      message: `Pass ${i + 1}: Finding minimum in range [${i}, ${result.length - 1}]`,
      highlight: `Starting search for minimum element in unsorted portion`,
      description: `Assume element at index ${i} is minimum: ${result[i]}`,
      stepNumber: stepCounter++
    });
    
    for (let j = i + 1; j < result.length; j++) {
      steps.push({
        type: 'compare',
        array: [...result],
        comparing: [minIndex, j],
        swapping: [],
        sorted: Array.from({length: i}, (_, idx) => idx),
        currentPass: i + 1,
        minIndex,
        currentElement: j,
        message: `Comparing current minimum ${result[minIndex]} with ${result[j]}`,
        highlight: `Checking if ${result[j]} < ${result[minIndex]}`,
        description: `Looking for smaller element in remaining unsorted portion`,
        stepNumber: stepCounter++
      });
      
      if (result[j] < result[minIndex]) {
        minIndex = j;
        steps.push({
          type: 'new-minimum',
          array: [...result],
          comparing: [minIndex, j],
          swapping: [],
          sorted: Array.from({length: i}, (_, idx) => idx),
          currentPass: i + 1,
          minIndex,
          message: `New minimum found: ${result[minIndex]} at index ${minIndex}`,
          highlight: `${result[minIndex]} is smaller than previous minimum`,
          description: `Update minimum index to ${minIndex}`,
          stepNumber: stepCounter++
        });
      }
    }
    
    if (minIndex !== i) {
      const temp = result[i];
      [result[i], result[minIndex]] = [result[minIndex], result[i]];
      
      steps.push({
        type: 'swap',
        array: [...result],
        comparing: [],
        swapping: [i, minIndex],
        sorted: Array.from({length: i}, (_, idx) => idx),
        currentPass: i + 1,
        minIndex: null,
        swappedValues: { from: temp, to: result[i] },
        message: `Swapping minimum ${result[i]} to position ${i}`,
        highlight: `Moving ${result[i]} from index ${minIndex} to sorted position ${i}`,
        description: `Exchanged ${temp} (at ${i}) with ${result[i]} (at ${minIndex})`,
        stepNumber: stepCounter++
      });
    } else {
      steps.push({
        type: 'no-swap',
        array: [...result],
        comparing: [],
        swapping: [],
        sorted: Array.from({length: i}, (_, idx) => idx),
        currentPass: i + 1,
        minIndex: null,
        message: `No swap needed - minimum ${result[i]} already at position ${i}`,
        highlight: `Element is already in correct position`,
        description: `Minimum element was already at the beginning of unsorted portion`,
        stepNumber: stepCounter++
      });
    }
    
    steps.push({
      type: 'mark-sorted',
      array: [...result],
      comparing: [],
      swapping: [],
      sorted: Array.from({length: i + 1}, (_, idx) => idx),
      currentPass: i + 1,
      minIndex: null,
      message: `Position ${i} is now sorted with value ${result[i]}`,
      highlight: `Sorted portion now includes ${i + 1} element(s)`,
      description: `Element ${result[i]} is in its final sorted position`,
      stepNumber: stepCounter++
    });
  }
  
  steps.push({
    type: 'complete',
    array: [...result],
    comparing: [],
    swapping: [],
    sorted: Array.from({length: result.length}, (_, idx) => idx),
    currentPass: result.length,
    minIndex: null,
    message: `Selection Sort completed! Array is now sorted.`,
    highlight: `Final result: [${result.join(', ')}]`,
    description: `All elements are in ascending order after ${result.length - 1} passes`,
    stepNumber: stepCounter++
  });
  
  return steps;
};

export const insertionSortSteps = (arr) => {
  const steps = [];
  const result = [...arr];
  let stepCounter = 1;
  
  steps.push({
    type: 'initialize',
    array: [...result],
    comparing: [],
    shifting: [],
    sorted: [0],
    currentElement: null,
    insertPosition: null,
    message: `Starting Insertion Sort on array of ${arr.length} elements`,
    highlight: `First element ${result[0]} is trivially sorted`,
    description: `Insertion sort builds sorted array one element at a time`,
    stepNumber: stepCounter++
  });
  
  for (let i = 1; i < result.length; i++) {
    const key = result[i];
    let j = i - 1;
    
    steps.push({
      type: 'select',
      array: [...result],
      comparing: [],
      shifting: [],
      sorted: Array.from({length: i}, (_, idx) => idx),
      currentElement: i,
      key,
      insertPosition: null,
      message: `Selecting element ${key} at index ${i} for insertion`,
      highlight: `Next element to insert into sorted portion: ${key}`,
      description: `Will find correct position for ${key} in sorted portion [0..${i-1}]`,
      stepNumber: stepCounter++
    });
    
    while (j >= 0 && result[j] > key) {
      steps.push({
        type: 'compare',
        array: [...result],
        comparing: [j, i],
        shifting: [],
        sorted: Array.from({length: i}, (_, idx) => idx),
        currentElement: i,
        key,
        comparePosition: j,
        message: `Comparing ${result[j]} > ${key}`,
        highlight: `${result[j]} is greater than ${key}, need to shift right`,
        description: `Element ${result[j]} at position ${j} is larger than key ${key}`,
        stepNumber: stepCounter++
      });
      
      steps.push({
        type: 'shift',
        array: [...result],
        comparing: [],
        shifting: [j, j + 1],
        sorted: Array.from({length: i}, (_, idx) => idx),
        currentElement: i,
        key,
        shiftFrom: j,
        shiftTo: j + 1,
        message: `Shifting ${result[j]} from position ${j} to ${j + 1}`,
        highlight: `Making space for insertion by moving element right`,
        description: `Shift ${result[j]} one position right to make room`,
        stepNumber: stepCounter++
      });
      
      result[j + 1] = result[j];
      j--;
    }
    
    if (j >= 0) {
      steps.push({
        type: 'found-position',
        array: [...result],
        comparing: [j, i],
        shifting: [],
        sorted: Array.from({length: i}, (_, idx) => idx),
        currentElement: i,
        key,
        insertPosition: j + 1,
        message: `Found insertion position: ${result[j]} <= ${key}`,
        highlight: `${key} should be inserted at position ${j + 1}`,
        description: `Element ${result[j]} is not greater than ${key}, so insert after it`,
        stepNumber: stepCounter++
      });
    } else {
      steps.push({
        type: 'insert-beginning',
        array: [...result],
        comparing: [],
        shifting: [],
        sorted: Array.from({length: i}, (_, idx) => idx),
        currentElement: i,
        key,
        insertPosition: 0,
        message: `${key} is smallest, insert at beginning`,
        highlight: `${key} is smaller than all sorted elements`,
        description: `Key ${key} is smaller than all elements in sorted portion`,
        stepNumber: stepCounter++
      });
    }
    
    result[j + 1] = key;
    
    steps.push({
      type: 'insert',
      array: [...result],
      comparing: [],
      shifting: [],
      sorted: Array.from({length: i + 1}, (_, idx) => idx),
      currentElement: null,
      key: null,
      insertPosition: j + 1,
      insertedValue: key,
      message: `Inserted ${key} at position ${j + 1}`,
      highlight: `${key} is now in correct sorted position`,
      description: `Sorted portion extended to include ${i + 1} elements`,
      stepNumber: stepCounter++
    });
  }
  
  steps.push({
    type: 'complete',
    array: [...result],
    comparing: [],
    shifting: [],
    sorted: Array.from({length: result.length}, (_, idx) => idx),
    currentElement: null,
    key: null,
    insertPosition: null,
    message: `Insertion Sort completed! Array is now sorted.`,
    highlight: `Final result: [${result.join(', ')}]`,
    description: `All elements inserted in correct positions through ${result.length - 1} iterations`,
    stepNumber: stepCounter++
  });
  
  return steps;
};

export const mergeSortSteps = (arr) => {
  const steps = [];
  const result = [...arr];
  
  const merge = (left, mid, right) => {
    const leftArr = result.slice(left, mid + 1);
    const rightArr = result.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        type: 'compare',
        array: [...result],
        comparing: [left + i, mid + 1 + j],
        message: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
        highlight: `Merging subarrays`
      });
      
      if (leftArr[i] <= rightArr[j]) {
        result[k] = leftArr[i];
        i++;
      } else {
        result[k] = rightArr[j];
        j++;
      }
      k++;
    }
    
    while (i < leftArr.length) {
      result[k] = leftArr[i];
      i++;
      k++;
    }
    
    while (j < rightArr.length) {
      result[k] = rightArr[j];
      j++;
      k++;
    }
  };
  
  const mergeSort = (left, right) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        type: 'divide',
        array: [...result],
        range: [left, right],
        message: `Dividing array from ${left} to ${right}`,
        highlight: `Divide phase: splitting array`
      });
      
      mergeSort(left, mid);
      mergeSort(mid + 1, right);
      merge(left, mid, right);
      
      steps.push({
        type: 'merge',
        array: [...result],
        merged: Array.from({length: right - left + 1}, (_, i) => left + i),
        message: `Merged subarray from ${left} to ${right}`,
        highlight: `Conquer phase: merging sorted subarrays`
      });
    }
  };
  
  mergeSort(0, result.length - 1);
  return steps;
};

export const quickSortSteps = (arr) => {
  const steps = [];
  const result = [...arr];
  
  const partition = (low, high) => {
    const pivot = result[high];
    let i = low - 1;
    
    steps.push({
      type: 'select-pivot',
      array: [...result],
      pivot: high,
      message: `Selected pivot: ${pivot}`,
      highlight: `Partitioning around pivot ${pivot}`
    });
    
    for (let j = low; j < high; j++) {
      steps.push({
        type: 'compare',
        array: [...result],
        comparing: [j, high],
        message: `Comparing ${result[j]} with pivot ${pivot}`,
        highlight: `Partitioning elements around pivot`
      });
      
      if (result[j] < pivot) {
        i++;
        [result[i], result[j]] = [result[j], result[i]];
        
        steps.push({
          type: 'swap',
          array: [...result],
          swapping: [i, j],
          message: `Swapped ${result[j]} and ${result[i]}`,
          highlight: `Moving smaller element to left of pivot`
        });
      }
    }
    
    [result[i + 1], result[high]] = [result[high], result[i + 1]];
    
    steps.push({
      type: 'place-pivot',
      array: [...result],
      pivot: i + 1,
      message: `Placed pivot ${pivot} at position ${i + 1}`,
      highlight: `Pivot in final position`
    });
    
    return i + 1;
  };
  
  const quickSort = (low, high) => {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  };
  
  quickSort(0, result.length - 1);
  return steps;
};