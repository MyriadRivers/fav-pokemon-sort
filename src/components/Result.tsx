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

const Result = ({name, image, rank}: {name: string, image: string, rank: number}) => {
    return (
        <StyledResult>
            <div className={"rank"}>{rank}</div>
            <img className={"resultImage"} src={image} alt={name} />
            {name}
        </StyledResult>
    )
}

export default Result;