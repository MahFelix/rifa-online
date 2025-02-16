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
    primary: { main: "#6166ff" },
    secondary: { main: "#6B5B95" },
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

const BuyButton = styled(Button)`
  && {
    margin-top: 10px;
    margin-bottom: 20px;
    background-color: #4caf50;
    color: white;
    &:hover {
      background-color: #66bb6a;
    }
  }
`;

function App() {
  const [soldNumbers, setSoldNumbers] = useState([]);
  const [searchNumber, setSearchNumber] = useState("");
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [buyerName, setBuyerName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSoldNumbersDialog, setOpenSoldNumbersDialog] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminIP = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "admin"));
        const adminIP = querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data().ip : null;

        if (!adminIP) return;

        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();

        if (data.ip === adminIP) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Erro ao verificar IP do admin:", error);
      }
    };

    fetchAdminIP();
  }, []);

  useEffect(() => {
    const fetchSoldNumbers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "soldNumbers"));
        const numbers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSoldNumbers(numbers);
      } catch (error) {
        console.error("Erro ao buscar números vendidos:", error);
      }
    };

    fetchSoldNumbers();
  }, []);

  const handleNumberClick = (number) => {
    if (soldNumbers.some((item) => item.number === number)) return; // Impede seleção de números vendidos

    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleBuyNumber = async () => {
    if (!buyerName.trim()) {
      setSnackbarMessage("Por favor, insira seu nome.");
      setOpenSnackbar(true);
      return;
    }
  
    try {
      // Monta a mensagem para o WhatsApp
      const phoneNumber = "+5579999163347"; // Ex: 5511999999999 (código do país + número)
      const message = `Olá! Gostaria de comprar os seguintes números: ${selectedNumbers.join(", ")} \nNome: ${buyerName} \nValor Total: R$ ${totalPrice.toFixed(2)}`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      // Marca os números como vendidos no Firebase
      const newSales = selectedNumbers.map((number) => ({ number, buyer: buyerName }));
      const docRefs = await Promise.all(newSales.map((sale) => addDoc(collection(db, "soldNumbers"), sale)));
      
      setSoldNumbers([...soldNumbers, ...docRefs.map((docRef, index) => ({ id: docRef.id, ...newSales[index] }))]);
      
      setSnackbarMessage(`Números ${selectedNumbers.join(", ")} comprados com sucesso por ${buyerName}!`);
      setOpenSnackbar(true);
      setOpenDialog(false);
      setBuyerName("");
      setSelectedNumbers([]);
      
      // Abre o WhatsApp
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Erro ao registrar a compra:", error);
      setSnackbarMessage("Erro ao processar a compra. Tente novamente.");
      setOpenSnackbar(true);
    }
  };

  const totalPrice = selectedNumbers.length * 5;

  const handleUnmarkNumber = async (numberId) => {
    try {
      await deleteDoc(doc(db, "soldNumbers", numberId));
      setSoldNumbers(soldNumbers.filter((item) => item.id !== numberId));
      setSnackbarMessage("Número desmarcado com sucesso!");
    } catch (error) {
      console.error("Erro ao desmarcar número:", error);
      setSnackbarMessage("Erro ao desmarcar número. Tente novamente.");
    }
    setOpenSnackbar(true);
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
          <SoldNumbersButton variant="contained" onClick={() => setOpenSoldNumbersDialog(true)}>
            Ver Números Vendidos ({soldNumbers.length})
          </SoldNumbersButton>
        </SearchContainer>

        <BuyButton
          variant="contained"
          onClick={() => setOpenDialog(true)}
          disabled={selectedNumbers.length === 0}
        >
          Comprar Números Selecionados ({selectedNumbers.length}) - Total: R$ {totalPrice.toFixed(2)}
        </BuyButton>

        <NumberGrid
          soldNumbers={soldNumbers.map((item) => item.number)}
          selectedNumbers={selectedNumbers}
          onNumberClick={handleNumberClick}
          searchNumber={searchNumber}
        />

        <Dialog open={openDialog} onClose={() => { setOpenDialog(false); setSelectedNumbers([]); }}>
          <DialogTitle>Comprar Números Selecionados</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Seu Nome e Sobrenome"
              type="text"
              fullWidth
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
            />
            <p>Números Selecionados: {selectedNumbers.join(", ")}</p>
            <p>Preço Total: R$ {totalPrice.toFixed(2)}</p>
            <h3>Todos os números serão validados via whatsapp, após o envio do comprovante de pagamento</h3>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleBuyNumber} color="primary">
              COMPRAR
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openSoldNumbersDialog} onClose={() => setOpenSoldNumbersDialog(false)}>
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
                      <Button color="secondary" onClick={() => handleUnmarkNumber(item.id)} style={{ marginLeft: "10px" }}>
                        Desmarcar
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSoldNumbersDialog(false)} color="primary">
              Fechar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} message={snackbarMessage} />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;