import { Pokemon, PokemonClient } from 'pokenode-ts';
import { useEffect, useRef, useState } from 'react';
import Comparison from './components/Comparison';
import ReadyIndicator from './components/ReadyIndicator';
import { Poke } from './types';
import { start } from 'repl';

const api = new PokemonClient();

const shuffle = (arr: Array<number>) => {
  let currIndex = arr.length;
  while (currIndex > 0) {
    let randIndex = Math.floor(Math.random() * arr.length);
    currIndex--;
    [arr[currIndex], arr[randIndex]] = [arr[randIndex], arr[currIndex]];
  }
}

function App() {
  const [totalPokemon, setTotalPokemon] = useState(0);
  const [unsortedIDs, setUnsortedIDs] = useState<Array<number> | null>(null);

  const [pokemonA, setPokemonA] = useState<Poke | null>(null);
  const [pokemonB, setPokemonB] = useState<Poke | null>(null);

  const [comparisonReady, setComparisonReady] = useState<boolean>(false);
  const [comparisonResolver, setComparisonResolver] = useState<Function>();

  const stack = useRef<Array<{seq: Array<number>, side: number}>>([]);
  const doneStack = useRef<Array<{seq: Array<number>, side: number}>>([]);

  const leftStack = useRef<Array<Array<number>>>([]);
  const rightStack = useRef<Array<Array<number>>>([]);

  const chosen = useRef<Array<{el: number, side: number}>>([]);

  const resolveComparison = async (): Promise<number> => {
    return new Promise((resolve) => {
      setComparisonResolver(() => (pokemon: string, num: number) => {
        setComparisonReady(false);
        console.log(pokemon);
        resolve(num);
      });
    })
  }

  const merge = async (left: Array<number>, right: Array<number>) => {
    let l = 0;
    let r = 0;
    let sorted = [];

    while (l < left.length && r < right.length) {
      let comparison = await comparePokemon(left[l], right[r]);
      if (comparison === 1) {
        // Left is better
        sorted.push(left[l]);
        l++;
      } else {
        // Right is better
        sorted.push(right[r]);
        r++;
      }
    }
    if (l < left.length) sorted = [...sorted, ...left.slice(l)];
    if (r < right.length) sorted = [...sorted, ...right.slice(r)];

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

  const mergeSort = async (arr: Array<number>) => {
    if (arr.length <= 1) return arr;
    let midpoint = Math.floor(arr.length / 2);
    let leftSide = arr.slice(0, midpoint);
    let rightSide = arr.slice(midpoint);
    leftSide = await mergeSort(leftSide);
    rightSide = await mergeSort(rightSide);
    let merged = await merge(leftSide, rightSide);
    return merged;
  }

  const logStacks = (startingMessage: string) => {
    function stringArr<T>(list: Array<T>) {
      let str = "[\n";
      for (let i = 0; i < list.length; i++) {
        str += list[i] + "\n";
      }
      str += "\n]";
      return str;
    }

    function stringSeq<T>(list: Array<{seq: Array<number>, side: number}>) {
      let str = "[\n";
      for (let i = 0; i < list.length; i++) {
        str += list[i].seq + " | " + list[i].side + "\n";
      }
      str += "\n]";
      return str;
    }

    console.log(startingMessage);
    console.log("stack: " + stringSeq(stack.current));
    console.log("left stack: " + stringArr(leftStack.current));
    console.log("right stack: " + stringArr(rightStack.current));
    console.log("done stack: " + stringSeq(doneStack.current));
  }

  const iterativeMergeSort = async (arr: Array<number>, debug: boolean = false) => {
    stack.current.push({seq: arr, side: 0});
    if (debug) logStacks("START");
    while (stack.current.length > 0) {
      while (leftStack.current.length === 0 || rightStack.current.length === 0) {
        let curr = stack.current[stack.current.length - 1];
        let midpoint = Math.floor(curr.seq.length / 2);
        let left = {seq: curr.seq.slice(0, midpoint), side: -1};
        let right = {seq: curr.seq.slice(midpoint), side: 1};

        if (left.seq.length > 1) {
          stack.current.push(left);
        } else {
          leftStack.current.push(left.seq);
        }
        if (right.seq.length > 1) {
          stack.current.push(right);
        } else {
          rightStack.current.push(right.seq);
        }
        if (debug) logStacks("AFTER SPLITTING TOP");
      }
      let curr = stack.current.pop();
      let left = leftStack.current.pop();
      let right = rightStack.current.pop();
      if (curr && left && right) {
        let sorted = await merge(left, right);
        if (curr.side === -1) {
          leftStack.current.push(sorted);
        } else if (curr.side === 1) {
          rightStack.current.push(sorted);
        }
        doneStack.current.push({seq: sorted, side: curr.side});
        if (debug) logStacks("AFTER PUSHING TO SORTED");
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
      setTotalPokemon(8);
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
        let sortedPokemon = await iterativeMergeSort(unsortedIDs);
        console.log("The sorted pokemon: " + sortedPokemon);        
      }
      sortPokemon();
    }
  }, [unsortedIDs]);

  const getRandomPokemon = async () => {
    let randomID = Math.ceil(Math.random() * totalPokemon);
    let randomPokemonA = await api.getPokemonById(randomID);
    randomID = Math.ceil(Math.random() * totalPokemon);
    let randomPokemonB = await api.getPokemonById(randomID);
    if (randomPokemonA.sprites.other?.['official-artwork'].front_default) setPokemonA({ name: randomPokemonA.name, image: randomPokemonA.sprites.other?.['official-artwork'].front_default });
    if (randomPokemonB.sprites.other?.['official-artwork'].front_default) setPokemonB({ name: randomPokemonB.name, image: randomPokemonB.sprites.other?.['official-artwork'].front_default });
  }

  return (
    <div className="App">
      <ReadyIndicator ready={comparisonReady} />
      <Comparison pokemonA={pokemonA} pokemonB={pokemonB} resolver={comparisonResolver ? comparisonResolver : null} ready={comparisonReady} />
    </div>
  );
}

export default App;
