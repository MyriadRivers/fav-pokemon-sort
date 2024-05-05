import styled from "styled-components";
import ComparisonCard from "./ComparisonCard";
import Button from "./Button";
import { useEffect, useRef } from "react";

const StyledComparison = styled.div`
    display: flex;
    flex-direction: column;
    background: pink;
    // flex: 1 1 auto;
    height: 100%;
    width: 100%;

    overflow: hidden;

    .cardHolder {
        display: flex;
        /* flex: 1 1 auto; */
        height: 100%;
    }

    .flexContainer {
        background: lavender;
        flex: 1 1 auto;
        min-height: 0;
        /* height: 100%; */
    }
`

const Comparison = ({ pokemonA, pokemonB, noUndo, resolver, ready }: {
    pokemonA: { name: string, image: string } | null,
    pokemonB: { name: string, image: string } | null,
    noUndo: boolean,
    resolver: Function | null,
    ready: boolean
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const flexContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const resizeImg = () => {
            if (!flexContainerRef.current || !containerRef.current) return;

            if (flexContainerRef.current.clientHeight > containerRef.current.clientHeight) {
                flexContainerRef.current.style.height = `${containerRef.current.clientHeight}px`;
            }

        }
        window.addEventListener("resize", resizeImg);
        window.dispatchEvent(new Event("resize"));

        return () => {
            window.removeEventListener("resize", resizeImg);
        }
    }, [])

    return (
        <StyledComparison ref={containerRef}>
            <div className={"flexContainer"} ref={flexContainerRef}>
                <div className={"cardHolder"}>
                    {pokemonA && <ComparisonCard name={pokemonA.name} image={pokemonA.image} resolver={resolver ? () => resolver(pokemonA.name, -1) : null} active={ready} />}
                    {pokemonB && <ComparisonCard name={pokemonB.name} image={pokemonB.image} resolver={resolver ? () => resolver(pokemonB.name, 1) : null} active={ready} />}
                </div>
            </div>
            <Button text={"UNDO"} disabled={noUndo} onClick={resolver ? () => resolver("UNDO", 0) : () => console.log("No resolver for comparison.")} />
        </StyledComparison>
    )
}

export default Comparison;