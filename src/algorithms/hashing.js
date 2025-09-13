// Helper function to convert key to character details
const keyToChars = (key) => {
  const keyStr = key.toString();
  return keyStr.split('').map((char, i) => ({
    char,
    charCode: char.charCodeAt(0),
    position: i
  }));
};

// Hash functions and table step generators (simplified, neutral terminology)

// Hash functions for visualizer
export const visualHashFunctions = {
  sum: (key, size) => {
    const keyStr = key.toString();
    const charCodes = keyStr.split('').map(char => char.charCodeAt(0));
    const sum = charCodes.reduce((acc, code) => acc + code, 0);
    const index = sum % size;
    return {
      hash: sum,
      index,
      steps: [
        `Key: "${keyStr}"`,
        `Character codes: [${charCodes.join(', ')}]`,
        `Sum: ${charCodes.join(' + ')} = ${sum}`,
        `Index: ${sum} % ${size} = ${index}`
      ]
    };
  },
  polynomial: (key, size) => {
    const keyStr = key.toString();
    const p = 31;
    const m = 1e9 + 9;
    let hash = 0, power = 1;
    const steps = [`Key: "${keyStr}"`, `Polynomial rolling hash:`];
    for (let i = 0; i < keyStr.length; i++) {
      const charCode = keyStr.charCodeAt(i);
      hash = (hash + (charCode * power)) % m;
      steps.push(`+ (${charCode} * ${power})`);
      power = (power * p) % m;
    }
    const finalHash = Math.floor(hash);
    const index = finalHash % size;
    steps.push(`Hash: ${finalHash}`);
    steps.push(`Index: ${finalHash} % ${size} = ${index}`);
    return { hash: finalHash, index, steps };
  },
  builtin: (key, size) => {
    // Simulate a built-in hash (not available in JS)
    const keyStr = key.toString();
    let hash = 0;
    for (let i = 0; i < keyStr.length; i++) {
      hash = ((hash << 5) - hash) + keyStr.charCodeAt(i);
      hash |= 0;
    }
    const finalHash = Math.abs(hash);
    const index = finalHash % size;
    return {
      hash: finalHash,
      index,
      steps: [
        `Key: "${keyStr}"`,
        `Built-in hash: ${finalHash}`,
        `Index: ${finalHash} % ${size} = ${index}`
      ]
    };
  }
};
// Hash table algorithms - pure functions that return step-by-step animations

// Enhanced hash functions with detailed computation steps
export const hashFunctions = {
  modulo: (key, size) => {
    const keyStr = key.toString();
    const charCodes = keyStr.split('').map(char => char.charCodeAt(0));
    const sum = charCodes.reduce((acc, code) => acc + code, 0);
    const hash = sum % size;
    
    return {
      result: hash,
      steps: [
        `Key: "${keyStr}"`,
        `Character codes: [${charCodes.join(', ')}]`,
        `Sum: ${charCodes.join(' + ')} = ${sum}`,
        `Hash: ${sum} mod ${size} = ${hash}`
      ]
    };
  },
  
  multiplication: (key, size) => {
    const keyStr = key.toString();
    const charCodes = keyStr.split('').map(char => char.charCodeAt(0));
    const sum = charCodes.reduce((acc, code) => acc + code, 0);
    const A = 0.6180339887; // Golden ratio constant
    const product = sum * A;
    const fractionalPart = product % 1;
    const hash = Math.floor(size * fractionalPart);
    
    return {
      result: hash,
      steps: [
        `Key: "${keyStr}"`,
        `Character codes: [${charCodes.join(', ')}]`,
        `Sum: ${sum}`,
        `Product: ${sum} × ${A.toFixed(10)} = ${product.toFixed(10)}`,
        `Fractional part: ${fractionalPart.toFixed(10)}`,
        `Hash: floor(${size} × ${fractionalPart.toFixed(6)}) = ${hash}`
      ]
    };
  },
  
  djb2: (key, size) => {
    const keyStr = key.toString();
    let hash = 5381;
    const steps = [`Initial hash: ${hash}`];
    
    for (let i = 0; i < keyStr.length; i++) {
      const charCode = keyStr.charCodeAt(i);
      const oldHash = hash;
      hash = ((hash << 5) + hash) + charCode;
      steps.push(`'${keyStr[i]}' (${charCode}): ${oldHash} << 5 + ${oldHash} + ${charCode} = ${hash}`);
    }
    
    const finalHash = Math.abs(hash) % size;
    steps.push(`Final: |${hash}| mod ${size} = ${finalHash}`);
    
    return {
      result: finalHash,
      steps
    };
  }
};

export const hashWithChainingSteps = (keys, tableSize = 10, hashFunction = 'modulo') => {
  const steps = [];
  const hashTable = Array(tableSize).fill(null).map(() => []);
  let stepCounter = 1;
  const hashFunc = (hashFunctions[hashFunction] || hashFunctions.modulo);
  
  steps.push({
    type: 'initialize',
    hashTable: JSON.parse(JSON.stringify(hashTable)),
    currentHashStep: null,
    message: `Initialized hash table (size ${tableSize}) using ${hashFunction} hash function`,
    highlight: `Ready for insertions (collision handling: chaining)`,
    description: `Load factor starts at 0.00`,
    stepNumber: stepCounter++
  });
  
  keys.forEach((key, keyIndex) => {
    const keyStr = key.toString();
    
    const hashResult = { index: hashFunc(key, tableSize).result };
    
    const hashValue = hashResult.hash || 0;
    const index = hashResult.index;
    const value = `value_${key}`;
    
    
    // Show detailed hash computation
    steps.push({
      type: 'hash-computation',
      hashTable: JSON.parse(JSON.stringify(hashTable)),
      currentHashStep: { 
        key: keyStr, 
        hash: hashValue, 
        function: hashFunction,
        computationSteps: hashResult.steps || [`Hash result: ${index}`]
      },
      message: `Computing hash for "${keyStr}"`,
      highlight: `Hash computation in progress`,
      description: `Converting characters to numeric value and applying ${hashFunction}`,
      stepNumber: stepCounter++
    });
    
    steps.push({
      type: 'hash-result',
      hashTable: JSON.parse(JSON.stringify(hashTable)),
      currentHashStep: { key: keyStr, hash: hashValue, index: index, function: hashFunction },
      message: `Hash result: "${keyStr}" → bucket ${index}`,
      highlight: `${hashFunction}("${keyStr}") = ${index}`,
      description: `Index chosen by hash function`,
      stepNumber: stepCounter++
    });
    
    const isCollision = hashTable[index].length > 0;
    
    if (isCollision) {
      steps.push({
        type: 'collision-detected',
        hashTable: JSON.parse(JSON.stringify(hashTable)),
        currentHashStep: { key: keyStr, hash: hashValue, index: index, collision: true },
        message: `Collision detected at bucket ${index}`,
        highlight: `Bucket size before insert: ${hashTable[index].length}`,
        description: `Chaining: appending to existing list`,
        stepNumber: stepCounter++
      });
    }
    
    hashTable[index].push({ key: keyStr, value });
    
    steps.push({
      type: 'insert-chaining',
      hashTable: JSON.parse(JSON.stringify(hashTable)),
      currentHashStep: { key: keyStr, hash: hashValue, index: index },
      inserted: index,
      key: keyStr,
      value,
      message: `Inserted "${keyStr}" -> "${value}" at bucket ${index}`,
      highlight: isCollision ? `Collision resolved via chaining (length now ${hashTable[index].length})` : `Inserted without collision`,
      description: `${isCollision ? 'Appended to existing chain' : 'First element in bucket'}`,
      stepNumber: stepCounter++
    });
  });
  
  steps.push({
    type: 'complete',
    hashTable: JSON.parse(JSON.stringify(hashTable)),
    currentHashStep: null,
    message: `Hash table construction completed`,
    highlight: `${keys.length} keys inserted`,
    description: `Final load factor: ${(keys.length / tableSize).toFixed(2)}`,
    stepNumber: stepCounter++
  });
  
  return steps;
};

export const hashWithLinearProbingSteps = (keys, tableSize = 10, hashFunction = 'modulo') => {
  const steps = [];
  const hashTable = Array(tableSize).fill(null);
  let stepCounter = 1;
  const hashFunc = (hashFunctions[hashFunction] || hashFunctions.modulo);
  
  steps.push({
    type: 'initialize',
    hashTable: [...hashTable],
    currentHashStep: null,
    message: `Initialized hash table (size ${tableSize}) using open addressing (linear probing)` ,
    highlight: `Each slot holds one key-value pair`,
    description: `Collisions resolved by probing to next slot`,
    stepNumber: stepCounter++
  });
  
  keys.forEach((key, keyIndex) => {
    const keyStr = key.toString();
    
    const hashResult = { index: hashFunc(key, tableSize).result };
    
    const hashValue = hashResult.hash || 0;
    const initialIndex = hashResult.index;
    const value = `value_${key}`;
    let currentIndex = initialIndex;
    let probeCount = 0;
    
    
    // Show detailed hash computation
    steps.push({
      type: 'hash-computation',
      hashTable: [...hashTable],
      currentHashStep: { 
        key: keyStr, 
        hash: hashValue, 
        function: hashFunction,
        computationSteps: hashResult.steps || [`Hash result: ${initialIndex}`]
      },
      message: `Computing hash for "${keyStr}"`,
      highlight: `Hash computation in progress`,
      description: `Applying ${hashFunction} to derive starting index`,
      stepNumber: stepCounter++
    });
    
    steps.push({
      type: 'hash-result',
      hashTable: [...hashTable],
      currentHashStep: { key: keyStr, hash: hashValue, index: initialIndex, function: hashFunction },
      message: `Hash result: "${keyStr}" → starting index ${initialIndex}`,
      highlight: `${hashFunction}("${keyStr}") = ${initialIndex}`,
      description: `Initial index before probing`,
      stepNumber: stepCounter++
    });
    
    // Find empty slot using linear probing
    while (hashTable[currentIndex] !== null && hashTable[currentIndex].key !== keyStr) {
      steps.push({
        type: 'collision-probe',
        hashTable: [...hashTable],
        currentHashStep: { 
          key: keyStr, 
          hash: hashValue, 
          initialIndex: initialIndex,
          currentProbe: currentIndex,
          probeCount: probeCount + 1,
          occupied: hashTable[currentIndex]
        },
        message: `Collision at bucket ${currentIndex}`,
        highlight: `Occupied by "${hashTable[currentIndex].key}" -> probing to ${(currentIndex + 1) % tableSize}`,
        description: `Bucket occupied, continue linear probing`,
        stepNumber: stepCounter++
      });
      
      currentIndex = (currentIndex + 1) % tableSize;
      probeCount++;
      
      if (probeCount >= tableSize) {
        steps.push({
          type: 'table-full',
          hashTable: [...hashTable],
          currentHashStep: { key: keyStr, hash: hashValue, initialIndex: initialIndex },
          message: `Hash table is full! Cannot insert "${keyStr}"`,
          highlight: `All ${tableSize} slots are already occupied`,
          description: `Open addressing failed - hash table needs to be resized`,
          stepNumber: stepCounter++
        });
        return;
      }
    }
    
    hashTable[currentIndex] = { key: keyStr, value };
    
    steps.push({
      type: 'insert-probing',
      hashTable: [...hashTable],
      currentHashStep: { 
        key: keyStr, 
        hash: hashValue,
        initialIndex: initialIndex,
        finalIndex: currentIndex,
        probeCount
      },
      inserted: currentIndex,
      key: keyStr,
      value,
      message: `Inserted "${keyStr}" -> "${value}" at bucket ${currentIndex}`,
      highlight: probeCount > 0 ? `Collision resolved after ${probeCount} probe(s)` : `Inserted without collision` ,
      description: `${probeCount > 0 ? `Found empty bucket after ${probeCount} probe(s)` : 'First occupant of bucket'}`,
      stepNumber: stepCounter++
    });
  });
  
  steps.push({
    type: 'complete',
    hashTable: [...hashTable],
    currentHashStep: null,
    message: `Hash table construction completed (linear probing)` ,
    highlight: `${keys.length} keys inserted`,
    description: `Final load factor: ${(keys.length / tableSize).toFixed(2)}`,
    stepNumber: stepCounter++
  });
  
  return steps;
};



// Simplified search steps builder combining both chaining and probing hash tables already built externally
export const hashSearchSteps = (hashTable, searchKey, hashFunction) => {
  const steps = [];
  const index = hashFunction(searchKey);
  steps.push({
    type: 'search-start',
    hashTable: JSON.parse(JSON.stringify(hashTable)),
    key: searchKey,
    index,
    message: `Searching for "${searchKey}" (start index ${index})`,
    highlight: `Begin search`
  });
  if (Array.isArray(hashTable[index])) {
    const bucket = hashTable[index];
    steps.push({
      type: 'bucket-scan',
      hashTable: JSON.parse(JSON.stringify(hashTable)),
      bucketIndex: index,
      message: `Scanning bucket ${index}`,
      highlight: `${bucket.length} entr${bucket.length===1?'y':'ies'}`
    });
    for (let i=0;i<bucket.length;i++) {
      steps.push({
        type: 'compare',
        hashTable: JSON.parse(JSON.stringify(hashTable)),
        bucketIndex: index,
        itemIndex: i,
        comparing: bucket[i].key,
        message: `Compare "${bucket[i].key}" to "${searchKey}"`,
        highlight: bucket[i].key===searchKey? 'Match' : 'No match'
      });
      if (bucket[i].key===searchKey) {
        steps.push({
          type: 'found',
          hashTable: JSON.parse(JSON.stringify(hashTable)),
          found: { bucket: index, item: i },
          result: bucket[i].value,
          message: `Found "${searchKey}" -> "${bucket[i].value}"`,
          highlight: 'Search successful'
        });
        return steps;
      }
    }
    steps.push({
      type: 'not-found',
      hashTable: JSON.parse(JSON.stringify(hashTable)),
      message: `Key "${searchKey}" not found in bucket ${index}`,
      highlight: 'Search unsuccessful'
    });
  } else {
    let currentIndex = index;
    let probes = 0;
    while (hashTable[currentIndex] !== null && probes < hashTable.length) {
      steps.push({
        type: 'probe',
        hashTable: [...hashTable],
        index: currentIndex,
        key: hashTable[currentIndex]?.key,
        message: `Probe ${currentIndex}: ${hashTable[currentIndex]?.key || 'empty'}`,
        highlight: hashTable[currentIndex]?.key === searchKey ? 'Match' : 'Check'
      });
      if (hashTable[currentIndex]?.key === searchKey) {
        steps.push({
          type: 'found',
          hashTable: [...hashTable],
          found: currentIndex,
            result: hashTable[currentIndex].value,
          probes,
          message: `Found "${searchKey}" -> "${hashTable[currentIndex].value}" at index ${currentIndex}`,
          highlight: `Search successful after ${probes} probe(s)`
        });
        return steps;
      }
      currentIndex = (currentIndex + 1) % hashTable.length;
      probes++;
    }
    steps.push({
      type: 'not-found',
      hashTable: [...hashTable],
      probes,
      message: `Key "${searchKey}" not found after ${probes} probe(s)`,
      highlight: 'Search unsuccessful'
    });
  }
  return steps;
};