import styled from "styled-components"

const StyledLabel = styled.div`
    text-align: center;
    
    padding: 20px;
    border: none;
`

const Label = ({ text }: { text: string }) => {
    return (
        <StyledLabel>
            {text}
        </StyledLabel>
    )
}

export default Label;