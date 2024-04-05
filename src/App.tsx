import { Pokemon, PokemonClient } from 'pokenode-ts';
import { useEffect, useRef, useState } from 'react';
import Comparison from './components/Comparison';
import ReadyIndicator from './components/ReadyIndicator';

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

  const [pokemonA, setPokemonA] = useState<{ name: string, image: string } | null>(null);
  const [pokemonB, setPokemonB] = useState<{ name: string, image: string } | null>(null);

  const [comparisonReady, setComparisonReady] = useState<boolean>(false);
  const [comparisonResolver, setComparisonResolver] = useState<Function>();

  const resolveComparison = async (): Promise<number> => {
    return new Promise((resolve) => {
      setComparisonResolver(() => (pokemon: string, num: number) => {
        setComparisonReady(false);
        console.log(pokemon);
        resolve(num);
      });
    })
  }

  const mergeSort = async (arr: Array<number>) => {

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

    const merge = async (left: Array<number>, right: Array<number>) => {
      let l = 0;
      let r = 0;
      let sorted = [];

      while (l < left.length && r < right.length) {
        let comparison = await comparePokemon(left[l], right[r]);
        if (comparison !== 1) {
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

    if (arr.length <= 1) return arr;
    let midpoint = Math.floor(arr.length / 2);
    let leftside = arr.slice(0, midpoint);
    let rightside = arr.slice(midpoint);
    leftside = await mergeSort(leftside);
    rightside = await mergeSort(rightside);
    let merged = merge(leftside, rightside);

    return merged;
  }

  // Get total pokemon at the start
  useEffect(() => {
    const getTotalPokemon = async () => {
      let total = await api.listPokemonSpecies();
      setTotalPokemon(4);
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
        let sortedPokemon = await mergeSort(unsortedIDs);
        console.log("The sorted pokemon: " + sortedPokemon);
      }
      sortPokemon();
    }
  }, [unsortedIDs])

  const getTotalPokemon = async () => {
    let total = await api.listPokemonSpecies();
    setTotalPokemon(total.count);
  }

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
      <Comparison pokemonA={pokemonA} pokemonB={pokemonB} resolver={comparisonResolver ? comparisonResolver : null} />
    </div>
  );
}

export default App;
