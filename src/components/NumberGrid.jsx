/* eslint-disable react/prop-types */
import styled from "styled-components";
import { Button } from "@mui/material";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 10px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const NumberButton = styled(Button)`
  && {
    font-size: 1.2rem;
    font-weight: bold;
    background-color: ${({ sold }) => (sold ? "#6B5B95" : "#FF6F61")};
    color: white;
    border-radius: 10px;
    padding: 10px;
    &:hover {
      background-color: ${({ sold }) => (sold ? "#6B5B95" : "#FF8C61")};
    }
  }
`;

// eslint-disable-next-line react/prop-types
function NumberGrid({ soldNumbers, onNumberClick, searchNumber }) {
  const numbers = Array.from({ length: 2000 }, (_, i) => i + 1);

    // Filtra os números se houver uma busca
    const filteredNumbers = searchNumber
    ? numbers.filter((num) => num.toString().startsWith(searchNumber))
    : numbers;

  return (
    <GridContainer>
    {filteredNumbers.map((number) => (
      <NumberButton
        key={number}
        sold={soldNumbers.includes(number)}
        onClick={() => onNumberClick(number)}
        disabled={soldNumbers.includes(number)}
      >
        {number}
      </NumberButton>
    ))}
  </GridContainer>
);
}

export default NumberGrid;