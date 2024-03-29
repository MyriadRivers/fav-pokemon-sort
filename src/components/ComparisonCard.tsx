import ColorThief, { color } from "@neutrixs/colorthief";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const StyledComparisonCard = styled.div<{ $bg: color | undefined }>`
    background: ${props => props.$bg ? `rgb(${props.$bg[0]}, ${props.$bg[1]}, ${props.$bg[2]})` : "white"};
    display: flex;
    flex-direction: column;
`

const ComparisonCard = ({ name, image }: { name: string, image: string }) => {
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
        <StyledComparisonCard $bg={bg}>
            {name}
            <img src={image} alt={name} ref={imgRef} />
        </StyledComparisonCard>
    )
}

export default ComparisonCard;