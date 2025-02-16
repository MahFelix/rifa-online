/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import styled from "styled-components";

const NumberContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
  overflow-y: auto;
  max-height: 70vh;

  @media (max-width: 768px) {
    gap: 6px;
    padding: 0 10px;
  }

  @media (max-width: 480px) {
    gap: 4px;
    padding: 0 5px;
  }
`;

const NumberItem = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ sold, selected }) => (sold ? "#e7ffcc" : selected ? "#ccffcc" : "#f0f0f0")};
  cursor: ${({ sold }) => (sold ? "not-allowed" : "pointer")};
  border-radius: 5px;
  border: 1px solid #ccc;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: ${({ selected }) => (selected ? "2px solid #4caf50" : "none")};
    border-radius: 5px;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 0.9em;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    font-size: 0.8em;
  }
`;

function NumberGrid({ soldNumbers, selectedNumbers, onNumberClick, numbers }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
      {numbers.map((number) => (
        <div
          key={number}
          onClick={() => onNumberClick(number)}
          style={{
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: soldNumbers.includes(number)
              ? "#ff6b6b"
              : selectedNumbers.includes(number)
              ? "#6166ff"
              : "#f0f0f0",
            color: soldNumbers.includes(number) || selectedNumbers.includes(number) ? "white" : "black",
            borderRadius: "5px",
            cursor: soldNumbers.includes(number) ? "not-allowed" : "pointer",
            opacity: soldNumbers.includes(number) ? 0.6 : 1,
          }}
        >
          {number}
        </div>
      ))}
    </div>
  );
}

export default NumberGrid;