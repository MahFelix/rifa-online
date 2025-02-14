import { useState, useEffect } from "react";
import styled from "styled-components";
import NumberGrid from "./components/NumberGrid";
import Header from "./components/Header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TextField } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF6F61",
    },
    secondary: {
      main: "#6B5B95",
    },
  },
});

const AppContainer = styled.div`
  text-align: center;
  font-family: "Comic Sans MS", cursive, sans-serif;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  min-height: 100vh;
  padding: 20px;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

function App() {
  const [soldNumbers, setSoldNumbers] = useState([]);
  const [searchNumber, setSearchNumber] = useState(""); // Estado para armazenar a busca

  useEffect(() => {
    // Carrega números vendidos do localStorage ao iniciar
    const savedNumbers = JSON.parse(localStorage.getItem("soldNumbers")) || [];
    setSoldNumbers(savedNumbers);
  }, []);

  const handleNumberClick = (number) => {
    if (!soldNumbers.includes(number)) {
      const updatedNumbers = [...soldNumbers, number];
      setSoldNumbers(updatedNumbers);
      localStorage.setItem("soldNumbers", JSON.stringify(updatedNumbers));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Header />

        {/* Campo de busca */}
        <SearchContainer>
          <TextField
            label="Buscar número"
            variant="outlined"
            type="number"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            sx={{ backgroundColor: "white", borderRadius: "5px" }}
          />
        </SearchContainer>

        <NumberGrid
          soldNumbers={soldNumbers}
          onNumberClick={handleNumberClick}
          searchNumber={searchNumber} // Passando o número buscado para o componente
        />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
