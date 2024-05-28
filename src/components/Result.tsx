import { Ref, forwardRef } from "react";
import styled from "styled-components";

const StyledResult = styled.div`
    background-color: #F0F0F0;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 10px;

    text-transform: capitalize;

    
    .resultImage {
        width: 100%;
    }

    .rank {

    }
`

const Result = ({name, image, rank, autoScroll}: {name: string, image: string, rank: number, autoScroll: Function}, ref: Ref<HTMLImageElement>) => {
    return (
        <StyledResult>
            <div className={"rank"}>{rank}</div>
            <img className={"resultImage"} src={image} alt={name} ref={ref} onLoad={autoScroll()}/>
            {name}
        </StyledResult>
    )
}

export default forwardRef(Result);