// Recursion algorithms - pure functions that return step-by-step animations
export const factorialSteps = (n) => {
  const steps = [];
  const callStack = [];

  const factorial = (num, depth = 0) => {
    callStack.push({ value: num, depth });
    steps.push({
      type: 'call',
      callStack: [...callStack],
      message: `Calling factorial(${num})`,
      highlight: `Making recursive call: factorial(${num})`,
      description: depth === 0
        ? `Begin computing ${n}! by expanding calls down to 1.`
        : `Dive deeper: need factorial(${num}) so we will call factorial(${num-1}).`
    });

    if (num <= 1) {
      steps.push({
        type: 'base-case',
        callStack: [...callStack],
        result: 1,
        message: `Base case: factorial(${num}) = 1`,
        highlight: `Reached base case: factorial(${num}) returns 1`,
        description: `Stop: factorial(${num}) is defined as 1 (base case). Start unwinding recursion.`
      });
      callStack.pop();
      return 1;
    }

    const result = num * factorial(num - 1, depth + 1);

    steps.push({
      type: 'return',
      callStack: [...callStack],
      result: result,
      message: `factorial(${num}) = ${num} × factorial(${num - 1}) = ${result}`,
      highlight: `Returning: ${num} × ${result / num} = ${result}`,
      description: `Resolved deeper call: multiply ${num} by factorial(${num-1}) to get ${result}.`
    });

    callStack.pop();
    return result;
  };

  const final = factorial(n);
  steps.push({
    type: 'complete',
    callStack: [],
    finalResult: final,
    message: `Completed: ${n}! = ${final}`,
    highlight: `Final result: ${n}! = ${final}`,
    description: `All recursive frames returned. The answer to ${n}! is ${final}.`
  });
  return steps;
};

export const fibonacciSteps = (n) => {
  const steps = [];
  const callStack = [];
  const memo = {};

  const fibonacci = (num, depth = 0) => {
    if (memo[num] !== undefined) {
      steps.push({
        type: 'memoized',
        callStack: [...callStack],
        value: num,
        result: memo[num],
        message: `Using memoized value: fibonacci(${num}) = ${memo[num]}`,
        highlight: `Cache hit: fibonacci(${num}) already computed`,
        description: `We already computed fib(${num}) earlier; reuse stored value ${memo[num]}.`,
        memoSnapshot: { ...memo }
      });
      return memo[num];
    }

    callStack.push({ value: num, depth });
    steps.push({
      type: 'call',
      callStack: [...callStack],
      message: `Calling fibonacci(${num})`,
      highlight: `Making recursive call: fibonacci(${num})`,
      description: depth === 0
        ? `Start computing fib(${n}) by branching until base cases (0 or 1).`
        : `Expand fib(${num}) into fib(${num-1}) + fib(${num-2}).`,
      memoSnapshot: { ...memo }
    });

    if (num <= 1) {
      steps.push({
        type: 'base-case',
        callStack: [...callStack],
        result: num,
        message: `Base case: fibonacci(${num}) = ${num}`,
        highlight: `Reached base case: fibonacci(${num}) returns ${num}`,
        description: `Base case encountered; return ${num}.`,
        memoSnapshot: { ...memo }
      });
      callStack.pop();
      memo[num] = num;
      return num;
    }

    const result = fibonacci(num - 1, depth + 1) + fibonacci(num - 2, depth + 1);

    steps.push({
      type: 'return',
      callStack: [...callStack],
      result: result,
      message: `fibonacci(${num}) = fibonacci(${num - 1}) + fibonacci(${num - 2}) = ${result}`,
      highlight: `Returning: ${result}`,
      description: `Combine results: fib(${num - 1}) + fib(${num - 2}) = ${result}.`,
      memoSnapshot: { ...memo }
    });

    callStack.pop();
    memo[num] = result;
    return result;
  };

  const final = fibonacci(n);
  steps.push({
    type: 'complete',
    callStack: [],
    finalResult: final,
    fibTree: true,
    message: `Completed: fib(${n}) = ${final}`,
    highlight: `Final result: fibonacci(${n}) = ${final}`,
    description: `All branches resolved; fib(${n}) = ${final}.`,
    memoSnapshot: { ...memo }
  });
  return steps;
};

export const towerOfHanoiSteps = (n, source = 'A', destination = 'C', auxiliary = 'B') => {
  const steps = [];
  const towers = { A: [], B: [], C: [] };
  let moveCount = 0;

  // Initialize tower A with disks
  for (let i = n; i >= 1; i--) {
    towers[source].push(i);
  }

  const cloneTowersArray = () => [
    [...towers.A],
    [...towers.B],
    [...towers.C]
  ];

  steps.push({
    type: 'initial',
    towers: cloneTowersArray(),
    moveCount,
    message: `Initial state: ${n} disks on tower ${source}`,
    highlight: `Goal: Move all disks from ${source} to ${destination}`,
    description: `Start: All ${n} disks stacked on rod ${source} (largest at bottom).`
  });

  const hanoi = (disks, src, dest, aux, depth = 0) => {
    if (disks === 1) {
      const disk = towers[src].pop();
      towers[dest].push(disk);
      moveCount++;
      steps.push({
        type: 'move',
        towers: cloneTowersArray(),
        move: { disk, from: src, to: dest },
        moveCount,
        message: `Move disk ${disk} from ${src} to ${dest}`,
        highlight: `Base case: Move single disk ${disk}`,
        description: `Direct move of smallest disk ${disk} from ${src} to ${dest}.`,
        depth
      });
      return;
    }

    steps.push({
      type: 'recursive-call',
      towers: cloneTowersArray(),
      moveCount,
      message: `Move ${disks - 1} disks from ${src} to ${aux}`,
      highlight: `Subproblem 1: Clear the way for largest disk`,
      description: `Stage 1: Temporarily relocate top ${disks - 1} disks to ${aux}.`,
      depth
    });

    hanoi(disks - 1, src, aux, dest, depth + 1);

    const disk = towers[src].pop();
    towers[dest].push(disk);
    moveCount++;
    steps.push({
      type: 'move',
      towers: cloneTowersArray(),
      move: { disk, from: src, to: dest },
      moveCount,
      message: `Move disk ${disk} from ${src} to ${dest}`,
      highlight: `Move largest disk ${disk}`,
      description: `Critical move: Largest of current stack (${disk}) to destination ${dest}.`,
      depth
    });

    steps.push({
      type: 'recursive-call',
      towers: cloneTowersArray(),
      moveCount,
      message: `Move ${disks - 1} disks from ${aux} to ${dest}`,
      highlight: `Subproblem 2: Move disks to final destination`,
      description: `Stage 2: Move ${disks - 1} disks from ${aux} onto ${dest} (on top of disk ${disk}).`,
      depth
    });

    hanoi(disks - 1, aux, dest, src, depth + 1);
  };

  hanoi(n, source, destination, auxiliary);

  steps.push({
    type: 'complete',
    towers: cloneTowersArray(),
    moveCount,
    message: `Puzzle solved! All disks moved to ${destination}`,
    highlight: `🎉 Tower of Hanoi completed in ${moveCount} moves`,
    description: `Finished: All disks transferred following optimal strategy.`
  });

  return steps;
};