import { useState, useEffect } from "react";
import styled from "styled-components";
import NumberGrid from "./components/NumberGrid";
import Header from "./components/Header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from "@mui/material";
import { db, auth } from "./firebase"; // Importe o auth do Firebase
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth"; // Importe as funções de autenticação
import Carousel from "./components/Carousel";
import GlobalStyle from "./styles/globalStyles";

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
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

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
    if (soldNumbers.some((item) => item.number === number)) return;

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
      const phoneNumbers = ["+5579996793694","+5579999163347"];
      const message = `Olá! Gostaria de comprar os seguintes números: ${selectedNumbers.join(", ")} \nNome: ${buyerName} \nValor Total: R$ ${totalPrice.toFixed(2)}\n*Os números serão validados após envio do comprovante de pagamento*\n Segue meu pix(CPF):\n *064.315.635-65*\n Victor Hugo `;

      const newSales = selectedNumbers.map((number) => ({ number, buyer: buyerName }));
      const docRefs = await Promise.all(newSales.map((sale) => addDoc(collection(db, "soldNumbers"), sale)));

      setSoldNumbers([...soldNumbers, ...docRefs.map((docRef, index) => ({ id: docRef.id, ...newSales[index] }))]);

      setSnackbarMessage(`Números ${selectedNumbers.join(", ")} comprados com sucesso por ${buyerName}!`);
      setOpenSnackbar(true);
      setOpenDialog(false);
      setBuyerName("");
      setSelectedNumbers([]);

      phoneNumbers.forEach(phoneNumber => {
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
      });
    } catch (error) {
      console.error("Erro ao registrar a compra:", error);
      setSnackbarMessage("Erro ao processar a compra. Tente novamente.");
      setOpenSnackbar(true);
    }
  };

  const totalPrice = selectedNumbers.length * 5;

  const filteredNumbers = Array.from({ length: 2000 }, (_, i) => i + 1).filter((number) => {
    return searchNumber ? number.toString().includes(searchNumber) : true;
  });

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

  const handleAdminLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      if (userCredential.user) {
        setIsAdmin(true);
        setLoginDialogOpen(false);
        setSnackbarMessage("Login realizado com sucesso!");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setSnackbarMessage("Erro ao fazer login. Verifique suas credenciais.");
      setOpenSnackbar(true);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
      setSnackbarMessage("Logout realizado com sucesso!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setSnackbarMessage("Erro ao fazer logout.");
      setOpenSnackbar(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle/>
    
      <AppContainer>
       
        <Header />
        <Carousel/>
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
          {!isAdmin ? (
            <Button variant="contained" color="secondary" onClick={() => setLoginDialogOpen(true)}>
              Login
            </Button>
          ) : (
            <Button variant="contained" color="secondary" onClick={handleAdminLogout}>
              Logout
            </Button>
          )}
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
          numbers={filteredNumbers}
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
            <h3>Todos os números serão validados via whatsapp, após o envio do comprovante de pagamento<br></br> Victor Hugo <br></br>Pix(CPF): 064.315.635-65</h3>
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

        <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
          <DialogTitle>Login Admin</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Senha"
              type="password"
              fullWidth
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLoginDialogOpen(false)} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleAdminLogin} color="primary">
              Login
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} message={snackbarMessage} />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;