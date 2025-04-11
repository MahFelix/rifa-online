import { useState, useEffect } from "react";
import styled from "styled-components";
import NumberGrid from "./components/NumberGrid";
import Header from "./components/Header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { db, auth } from "./firebase";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import Carousel from "./components/Carousel";
import GlobalStyle from "./styles/globalStyles";
import SearchBar from "./components/SearchBar";
import BuyButton from "./components/BuyButton";
import SoldNumbersButton from "./components/SoldNumbers";
import BuyDialog from "./components/BuyDialog";
import PaymentDialog from "./components/PaymentDialog";
import SoldNumbersDialog from "./components/SoldNumberDialog";
import LoginDialog from "./components/LoginDialog";
import SnackbarNotification from "./components/SnackbarNotification";

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

const Button = styled.button``;

function App() {
  const [soldNumbers, setSoldNumbers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("number");
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [buyerName, setBuyerName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
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

  const handleBuyClick = () => {
    setOpenDialog(false);
    setOpenPaymentDialog(true);
  };

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
      const phoneNumbers = ["5579996793694"];
      const message = `Olá! Gostaria de comprar os seguintes números: ${selectedNumbers.join(", ")} \nNome: ${buyerName} \nValor Total: R$ ${totalPrice.toFixed(2)}\n*Os números serão validados após envio do comprovante de pagamento*\nSegue meu pix(CPF):\n*064.315.635-65*\n*Victor Hugo*`;

      const newSales = selectedNumbers.map((number) => ({ number, buyer: buyerName }));
      const docRefs = await Promise.all(newSales.map((sale) => addDoc(collection(db, "soldNumbers"), sale)));

      setSoldNumbers([...soldNumbers, ...docRefs.map((docRef, index) => ({ id: docRef.id, ...newSales[index] }))]);

      setSnackbarMessage(`Números ${selectedNumbers.join(", ")} comprados com sucesso por ${buyerName}!`);
      setOpenSnackbar(true);
      setOpenPaymentDialog(false);
      setBuyerName("");
      setSelectedNumbers([]);

      phoneNumbers.forEach((phoneNumber) => {
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
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
    return searchTerm && searchType === "number" ? number.toString().includes(searchTerm) : true;
  });

  const filteredSoldNumbers = soldNumbers.filter((item) => {
    if (!searchTerm) return true;
    if (searchType === "number") {
      return item.number.toString().includes(searchTerm);
    } else {
      return item.buyer?.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  const highlightedNumbers = searchType === "name" && searchTerm
    ? soldNumbers
        .filter((item) => item.buyer?.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((item) => item.number)
    : [];

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
      <GlobalStyle />
      <AppContainer>
        <Header />
        <Carousel />
        <SearchContainer>
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            searchType={searchType}
            onSearchTypeChange={(e) => setSearchType(e.target.value)}
          />
          <SoldNumbersButton
            onClick={() => setOpenSoldNumbersDialog(true)}
            soldNumbersCount={soldNumbers.length}
          />
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
          onClick={() => setOpenDialog(true)}
          disabled={selectedNumbers.length === 0}
          selectedNumbers={selectedNumbers}
          totalPrice={totalPrice}
        />

        <NumberGrid
          soldNumbers={soldNumbers.map((item) => item.number)}
          selectedNumbers={selectedNumbers}
          onNumberClick={handleNumberClick}
          numbers={filteredNumbers}
          highlightedNumbers={highlightedNumbers}
        />

        <BuyDialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setSelectedNumbers([]);
          }}
          buyerName={buyerName}
          onBuyerNameChange={(e) => setBuyerName(e.target.value)}
          selectedNumbers={selectedNumbers}
          totalPrice={totalPrice}
          onBuyClick={handleBuyClick}
        />

        <PaymentDialog
          open={openPaymentDialog}
          onClose={() => setOpenPaymentDialog(false)}
          selectedNumbers={selectedNumbers}
          totalPrice={totalPrice}
          onConfirmPayment={handleBuyNumber}
        />

        <SoldNumbersDialog
          open={openSoldNumbersDialog}
          onClose={() => setOpenSoldNumbersDialog(false)}
          soldNumbersSearch={searchTerm}
          onSoldNumbersSearchChange={(e) => setSearchTerm(e.target.value)}
          filteredSoldNumbers={filteredSoldNumbers}
          isAdmin={isAdmin}
          onUnmarkNumber={handleUnmarkNumber}
          searchType={searchType}
          onSearchTypeChange={(e) => setSearchType(e.target.value)}
        />

        <LoginDialog
          open={loginDialogOpen}
          onClose={() => setLoginDialogOpen(false)}
          adminEmail={adminEmail}
          onAdminEmailChange={(e) => setAdminEmail(e.target.value)}
          adminPassword={adminPassword}
          onAdminPasswordChange={(e) => setAdminPassword(e.target.value)}
          onLogin={handleAdminLogin}
        />

        <SnackbarNotification
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
          message={snackbarMessage}
        />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;