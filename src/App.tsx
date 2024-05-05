import { PokemonClient } from 'pokenode-ts';
import { useEffect, useRef, useState } from 'react';
import Comparison from './components/Comparison';
import ReadyIndicator from './components/ReadyIndicator';
import { Poke } from './types';
import GlobalStyle from './styles/globalStyles';
import Label from './components/Label';
import Results from './components/Results';
import styled from 'styled-components';

const api = new PokemonClient();

const StyledApp = styled.div`
  height: 100%;
  width: 100%;
  
  display: flex;
  flex-direction: column;

  .comparisonPage {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
`

const shuffle = (arr: Array<number>) => {
  let currIndex = arr.length;
  while (currIndex > 0) {
    let randIndex = Math.floor(Math.random() * arr.length);
    currIndex--;
    [arr[currIndex], arr[randIndex]] = [arr[randIndex], arr[currIndex]];
  }
}

const arraysEqual = (a: Array<any>, b: Array<any>): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function App() {
  const [totalPokemon, setTotalPokemon] = useState(0);
  const [unsortedIDs, setUnsortedIDs] = useState<Array<number> | null>(null);
  const [sortedIDs, setSortedIDs] = useState<Array<number> | null>(null);

  const [pokemonA, setPokemonA] = useState<Poke | null>(null);
  const [pokemonB, setPokemonB] = useState<Poke | null>(null);

  const [comparisonReady, setComparisonReady] = useState<boolean>(false);
  const [comparisonResolver, setComparisonResolver] = useState<Function>();

  // Stacks used for iterative merge sort
  const stack = useRef<Array<{ seq: Array<number>, side: number }>>([]);
  const prevStack = useRef<Array<{ left: Array<number>, right: Array<number> }>>([]);
  const doneStack = useRef<Array<{ seq: Array<number>, side: number }>>([]);

  const leftStack = useRef<Array<Array<number>>>([]);
  const rightStack = useRef<Array<Array<number>>>([]);
  const lrStack = useRef<Array<{ seq: Array<number>, side: number }>>([]);

  const chosen = useRef<Array<{ el: number, side: number }>>([]);

  // Indices and sides used for the actual merging
  const l = useRef<number>(0);
  const r = useRef<number>(0);
  const remainingL = useRef<number>(0);
  const remainingR = useRef<number>(0);
  const left = useRef<Array<number>>([]);
  const right = useRef<Array<number>>([]);

  const resolveComparison = async (): Promise<number> => {
    return new Promise((resolve) => {
      setComparisonResolver(() => (pokemon: string, num: number) => {
        setComparisonReady(false);
        console.log(pokemon);
        resolve(num);
      });
    })
  }

  const merge = async (debug: boolean = false) => {
    let sorted = [];

    while (l.current < left.current.length && r.current < right.current.length) {
      if (debug) {
        console.log("\nComparing " + left.current + " and " + right.current);
        console.log("L index: " + l.current + ", R index: " + r.current);
      }
      let comparison = await comparePokemon(left.current[l.current], right.current[r.current]);
      if (comparison === -1) {
        // Left is better
        sorted.push(left.current[l.current]);
        chosen.current.push({ el: left.current[l.current], side: -1 })
        l.current++;
      } else if (comparison === 1) {
        // Right is better
        sorted.push(right.current[r.current]);
        chosen.current.push({ el: right.current[r.current], side: 1 })
        r.current++;
      } else {
        // Undo
        if (l.current > 0 || r.current > 0) {
          // Step backwards in comparing the same two sequences
          let prev = chosen.current.pop();
          sorted.pop();
          if (prev) {
            if (prev.side === -1) {
              l.current--;
            } else if (prev.side === 1) {
              r.current--;
            }
          }
        } else {
          // Move to comparing the last elements of the previous two sequences
          if (debug) console.log("Going to last two sequences...");

          if (doneStack.current.length > 0) {
            let prev = prevStack.current.pop();
            let prevSorted = doneStack.current.pop();
            if (prev && prevSorted) {
              let prevPushed = lrStack.current.pop();
              if (prevPushed) {
                while (!arraysEqual(prevPushed ? prevPushed.seq : [], prevSorted.seq)) {
                  if (prevPushed) {
                    if (prevPushed.side === -1) {
                      leftStack.current.pop();
                    } else if (prevPushed.side === 1) {
                      rightStack.current.pop();
                    }
                  }
                  prevPushed = lrStack.current.pop();
                }
              }
              // Take off the finished sorted one from the previous comparison from the stack
              if (prevSorted.side === -1) {
                leftStack.current.pop();
              } else if (prevSorted.side === 1) {
                rightStack.current.pop();
              }

              leftStack.current.push(prev.left);
              rightStack.current.push(prev.right);
              // prevSorted != original sequence on stack, 
              // but it shouldn't matter because the sequences on stack should
              // only matter for the first generation of the recursive stack
              // to get the correct lefts and rights, but undoing already leaves a record of that?
              stack.current.push(prevSorted);

              // Start a step after so later we can take both of them back a step
              left.current = prev.left;
              right.current = prev.right;
              l.current = prev.left.length;
              r.current = prev.right.length;

              // Step back to the last actual choice the user made
              while (remainingL.current > 0 || remainingR.current > 0) {
                let autoChosen = chosen.current.pop();
                if (autoChosen) {
                  if (autoChosen.side === -1) {
                    l.current--;
                    remainingL.current--;
                  } else if (autoChosen.side === 1) {
                    r.current--;
                    remainingR.current--;
                  }
                }
              }
              while (l.current >= left.current.length || r.current >= right.current.length) {
                let autoChosen = chosen.current.pop();
                if (autoChosen) {
                  if (autoChosen.side === -1) {
                    l.current--;
                  } else if (autoChosen.side === 1) {
                    r.current--;
                  }
                }
              }

              if (debug) {
                logStacks("Finished with the UNDO");
                console.log("\nComparing " + left.current + " and " + right.current);
                console.log("L index: " + l.current + ", R index: " + r.current);
              }
              return;
            }
          } else {
            console.log("No more to undo.")
          }
        }
      }
    }
    if (l.current < left.current.length) {
      sorted = [...sorted, ...left.current.slice(l.current)];
      remainingL.current = 0;
      while (l.current + remainingL.current < left.current.length) {
        chosen.current.push({ el: left.current[remainingL.current], side: -1 });
        remainingL.current++
      }
    }
    if (r.current < right.current.length) {
      sorted = [...sorted, ...right.current.slice(r.current)];
      remainingR.current = 0;
      while (r.current + remainingR.current < right.current.length) {
        chosen.current.push({ el: right.current[remainingR.current], side: 1 });
        remainingR.current++
      }
    }
    // Only reset the L and R indices if it's done with the sequence
    l.current = 0;
    r.current = 0;
    remainingL.current = 0;
    remainingR.current = 0;

    return sorted;
  }

  const comparePokemon = async (a: number, b: number): Promise<number> => {
    // Set the pokemon images
    let pokeA = await api.getPokemonById(a);
    let pokeB = await api.getPokemonById(b);
    if (pokeA.sprites.other?.['official-artwork'].front_default) setPokemonA({ name: pokeA.name, image: pokeA.sprites.other?.['official-artwork'].front_default });
    if (pokeB.sprites.other?.['official-artwork'].front_default) setPokemonB({ name: pokeB.name, image: pokeB.sprites.other?.['official-artwork'].front_default });
    setComparisonReady(true);
    let comp = await resolveComparison();
    return comp;
  }

  const logStacks = (startingMessage: string) => {
    function stringArr(list: Array<any>) {
      let str = "[\n";
      for (let i = 0; i < list.length; i++) {
        str += list[i] + "\n";
      }
      return str;
    }

    function stringSeq(list: Array<any>) {
      let str = "[\n";
      for (let i = 0; i < list.length; i++) {
        for (const prop in list[i]) {
          str += ` ${prop}: ${list[i][prop]}`;
        }
        str += "\n";
      }
      str += "\n]";
      return str;
    }

    console.log(startingMessage);
    console.log("stack: " + stringSeq(stack.current));
    console.log("left stack: " + stringArr(leftStack.current));
    console.log("right stack: " + stringArr(rightStack.current));
    console.log("lr stack: " + stringSeq(lrStack.current));
    console.log("prev stack: " + stringSeq(prevStack.current));
    console.log("done stack: " + stringSeq(doneStack.current));
  }

  const iterativeMergeSort = async (arr: Array<number>, debug: boolean = false) => {
    stack.current.push({ seq: arr, side: 0 });
    if (debug) logStacks("START");
    while (stack.current.length > 0) {
      while (leftStack.current.length === 0 || rightStack.current.length === 0) {
        let curr = stack.current[stack.current.length - 1];
        let midpoint = Math.floor(curr.seq.length / 2);
        let left = { seq: curr.seq.slice(0, midpoint), side: -1 };
        let right = { seq: curr.seq.slice(midpoint), side: 1 };

        if (left.seq.length > 1) {
          stack.current.push(left);
        } else {
          leftStack.current.push(left.seq);
          lrStack.current.push(left);
        }
        if (right.seq.length > 1) {
          stack.current.push(right);
        } else {
          rightStack.current.push(right.seq);
          lrStack.current.push(right);
        }
        if (debug) logStacks("AFTER SPLITTING TOP");
      }
      let curr = stack.current[stack.current.length - 1];
      left.current = leftStack.current[leftStack.current.length - 1];
      right.current = rightStack.current[rightStack.current.length - 1];

      if (curr) {
        let sorted = await merge(debug);
        if (sorted) {
          // If sorted is an array, comparison was successful
          stack.current.pop();
          leftStack.current.pop();
          rightStack.current.pop();

          prevStack.current.push({ left: left.current, right: right.current });
          doneStack.current.push({ seq: sorted, side: curr.side });

          if (curr.side === -1) {
            leftStack.current.push(sorted);
            lrStack.current.push({ seq: sorted, side: -1 });
          } else if (curr.side === 1) {
            rightStack.current.push(sorted);
            lrStack.current.push({ seq: sorted, side: 1 });
          }
        }
        if (debug) logStacks("AFTER PUSHING TO SORTED");
        // Otherwise, it's an undo action, so just continue the loop
      } else {
        console.log("No left or right arrays available in stack.");
        break;
      }
    }
    return doneStack.current[doneStack.current.length - 1].seq;
  }

  // Get total pokemon at the start
  useEffect(() => {
    const getTotalPokemon = async () => {
      let total = await api.listPokemonSpecies();
      // setTotalPokemon(total.count);
      setTotalPokemon(3);
    }
    getTotalPokemon();
  }, [])

  // Shuffle the IDs
  useEffect(() => {
    let ids = Array.from({ length: totalPokemon }, (_, i) => i + 1);
    shuffle(ids);
    setUnsortedIDs([...ids]);
  }, [totalPokemon]);

  // Call sort on the shuffled IDs
  useEffect(() => {
    console.log(unsortedIDs);
    if (totalPokemon > 0 && unsortedIDs) {
      const sortPokemon = async () => {
        console.log("The unsorted pokemon: " + unsortedIDs);
        let sortedPokemon = await iterativeMergeSort(unsortedIDs, false);
        console.log("The sorted pokemon: " + sortedPokemon);
        setSortedIDs(sortedPokemon);
      }
      sortPokemon();
    }
  }, [unsortedIDs]);

  return (
    <StyledApp>
      <GlobalStyle />
      <div className="comparisonPage">
        <ReadyIndicator ready={comparisonReady} />
        <Label text={"Choose the one you like better."} />
        <Comparison pokemonA={pokemonA} pokemonB={pokemonB} noUndo={chosen.current.length === 0} resolver={comparisonResolver ? comparisonResolver : null} ready={comparisonReady} />
      </div>
      <Results ids={sortedIDs} api={api} />
    </StyledApp>
  );
}

export default App;
