import { useEffect, useState } from "react";

function useMergeSort<T>(sequence: Array<T>) {
    const [stack, setStack] = useState<Array<{seq: Array<T>, side: number}>>([]);
    const [doneStack, setDoneStack] = useState<Array<{seq: Array<T>, side: number}>>([]);

    const [leftStack, setLeftStack] = useState<Array<Array<T>>>([]);
    const [rightStack, setRightStack] = useState<Array<Array<T>>>([]);

    const [chosen, setChosen] = useState<Array<{el: T, side: number}>>([]);

    useEffect(() => {
        setStack([{seq: sequence, side: 0}]);

        while (stack.length > 0) {
            let curr = stack.pop();
            console.log(curr);
        }
    }, [])
}

export default useMergeSort;