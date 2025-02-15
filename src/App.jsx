import { useState, useEffect } from "react";
import styled from "styled-components";
import NumberGrid from "./components/NumberGrid";
import Header from "./components/Header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from "@mui/material";
import { db } from "./firebase";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6166ff",
    },
    secondary: {
      main: "#6B5B95",
    },
  },
});

const AppContainer = styled.div`
  text-align: center;
  font-family: "Comic Sans MS", cursive, sans-serif;
  background: linear-gradient(135deg, #f6d365 50%, #fda085 100%);
  min-height: 100vh;
  padding: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const SoldNumbersButton = styled(Button)`
  && {
    background-color: #6B5B95;
    color: white;
    &:hover {
      background-color: #7C6BA0;
    }
  }
`;

function App() {
  const [soldNumbers, setSoldNumbers] = useState([]);
  const [searchNumber, setSearchNumber] = useState("");
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [buyerName, setBuyerName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSoldNumbersDialog, setOpenSoldNumbersDialog] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Verifica se o IP atual é o IP do admin
  useEffect(() => {
    const fetchAdminIP = async () => {
      const querySnapshot = await getDocs(collection(db, "admin"));
      const adminIP = querySnapshot.docs[0]?.data().ip;

      // Obtém o IP do usuário atual
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const userIP = data.ip;

      // Verifica se o IP do usuário é o IP do admin
      if (userIP === adminIP) {
        setIsAdmin(true);
      }
    };

    fetchAdminIP();
  }, []);

  // Carrega os números vendidos do Firestore ao iniciar
  useEffect(() => {
    const fetchSoldNumbers = async () => {
      const querySnapshot = await getDocs(collection(db, "soldNumbers"));
      const numbers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSoldNumbers(numbers);
    };

    fetchSoldNumbers();
  }, []);

  const handleNumberClick = (number) => {
    setSelectedNumber(number);
    setOpenDialog(true);
  };

  const handleBuyNumber = async () => {
    if (!buyerName.trim()) {
      setSnackbarMessage("Por favor, insira seu nome.");
      setOpenSnackbar(true);
      return;
    }

    const newSale = { number: selectedNumber, buyer: buyerName };

    try {
      // Adiciona o número vendido ao Firestore
      await addDoc(collection(db, "soldNumbers"), newSale);
      setSoldNumbers([...soldNumbers, newSale]);
      setOpenDialog(false);
      setBuyerName("");
      setSnackbarMessage(`Número ${selectedNumber} comprado com sucesso por ${buyerName}!`);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erro ao salvar no Firestore: ", error);
      setSnackbarMessage("Erro ao processar a compra. Tente novamente.");
      setOpenSnackbar(true);
    }
  };

  const handleUnmarkNumber = async (numberId) => {
    try {
      // Remove o número vendido do Firestore
      await deleteDoc(doc(db, "soldNumbers", numberId));
      setSoldNumbers(soldNumbers.filter((item) => item.id !== numberId));
      setSnackbarMessage("Número desmarcado com sucesso!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erro ao desmarcar número: ", error);
      setSnackbarMessage("Erro ao desmarcar número. Tente novamente.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setBuyerName("");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenSoldNumbersDialog = () => {
    setOpenSoldNumbersDialog(true);
  };

  const handleCloseSoldNumbersDialog = () => {
    setOpenSoldNumbersDialog(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Header />

        <SearchContainer>
          <TextField
            label="Buscar número"
            variant="outlined"
            type="number"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            sx={{ backgroundColor: "white", borderRadius: "5px", width: "300px" }}
          />
          <SoldNumbersButton variant="contained" onClick={handleOpenSoldNumbersDialog}>
            Ver Números Vendidos ({soldNumbers.length})
          </SoldNumbersButton>
        </SearchContainer>

        <NumberGrid
          soldNumbers={soldNumbers.map((item) => item.number)}
          onNumberClick={handleNumberClick}
          searchNumber={searchNumber}
        />

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Comprar Número {selectedNumber}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Seu Nome"
              type="text"
              fullWidth
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
            />
            <p>Preço: R$ 5,00</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleBuyNumber} color="primary">
              Comprar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openSoldNumbersDialog} onClose={handleCloseSoldNumbersDialog}>
          <DialogTitle>Números Vendidos</DialogTitle>
          <DialogContent>
            {soldNumbers.length === 0 ? (
              <p>Nenhum número vendido ainda.</p>
            ) : (
              <ul>
                {soldNumbers.map((item) => (
                  <li key={item.id}>
                    Número {item.number} - Comprado por: {item.buyer}
                    {isAdmin && (
                      <Button
                        color="secondary"
                        onClick={() => handleUnmarkNumber(item.id)}
                        style={{ marginLeft: "10px" }}
                      >
                        Desmarcar
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSoldNumbersDialog} color="primary">
              Fechar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;