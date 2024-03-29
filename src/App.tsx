import { Pokemon, PokemonClient } from 'pokenode-ts';
import { useEffect, useRef, useState } from 'react';
import Comparison from './components/Comparison';

const api = new PokemonClient();

const shuffle = (arr: Array<number>) => {
  let currIndex = arr.length;
  while (currIndex >= 0) {
    let randIndex = Math.floor(Math.random() * arr.length);
    currIndex--;
    [arr[currIndex], arr[randIndex]] = [arr[randIndex], arr[currIndex]];
  }
}

function App() {
  const [totalPokemon, setTotalPokemon] = useState(0);
  const [pokemonA, setPokemonA] = useState<{ name: string, image: string } | null>(null);
  const [pokemonB, setPokemonB] = useState<{ name: string, image: string } | null>(null);

  const sortedList = useRef<Array<number>>([]);

  const mergeSort = (arr: Array<number>) => {
    const compare = (a: number, b: number): number => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    }

    const merge = (left: Array<number>, right: Array<number>) => {
      let l = 0;
      let r = 0;
      let sorted = [];

      while (l < left.length && r < right.length) {
        if (compare(left[l], right[r]) !== 1) {
          sorted.push(left[l]);
          l++;
        } else {
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
    leftside = mergeSort(leftside);
    rightside = mergeSort(rightside);
    let merged = merge(leftside, rightside);

    return merged;
  }

  useEffect(() => {
    const getTotalPokemon = async () => {
      let total = await api.listPokemonSpecies();
      setTotalPokemon(total.count);
    }
    getTotalPokemon();

    let ids = Array.from({ length: totalPokemon }, (_, i) => i + 1);
    shuffle(ids);
    console.log(ids);
    console.log("sorting...")
    let arr2 = mergeSort(ids);
    console.log(arr2);
  }, [])

  useEffect(() => {
    if (totalPokemon > 0) {
      getRandomPokemon();
    }
  }, [totalPokemon])

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
      <Comparison pokemonA={pokemonA} pokemonB={pokemonB} />
      <button onClick={getRandomPokemon}>Get a Pokemon!</button>
    </div>
  );
}

export default App;
