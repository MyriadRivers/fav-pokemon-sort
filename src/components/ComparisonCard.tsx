import ColorThief, { color } from "@neutrixs/colorthief";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const StyledComparisonCard = styled.div<{ $bg: color | undefined, $active: boolean }>`
    background: ${props => props.$bg ? `rgb(${props.$bg[0]}, ${props.$bg[1]}, ${props.$bg[2]})` : "white"};
    display: flex;
    flex-direction: column;
    pointer-events: ${props => props.$active ? "auto" : "none"};

    &:hover {
        cursor: pointer;
    }
`

const ComparisonCard = ({ name, image, resolver, active }: { name: string, image: string, resolver: Function | null, active: boolean }) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [bg, setBG] = useState<color>();

    useEffect(() => {
        if (imgRef.current) {
            imgRef.current.crossOrigin = "Anonymous";
            imgRef.current.onload = () => setColor();
        }
    }, [])

    const setColor = () => {
        if (imgRef.current) {
            let colorThief = new ColorThief();
            let palette = colorThief.getPalette(imgRef.current);
            let c = palette[0];
            setBG(lighten(c, 0.5));
        }
    }

    const lighten = (c: color, percent: number): color => {
        return [c[0] * (1 - percent) + 255 * percent, c[1] * (1 - percent) + 255 * percent, c[2] * (1 - percent) + 255 * percent];
    }

    return (
        <StyledComparisonCard $bg={bg} $active={active} onClick={resolver ? () => resolver() : () => console.log("No resolver for comparison.")}>
            {name}
            <img src={image} alt={name} ref={imgRef} />
        </StyledComparisonCard>
    )
}

export default ComparisonCard;