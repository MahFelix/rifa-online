import styled from "styled-components";

const HeaderContainer = styled.header`
  background-color: #6B5B95;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

function Header() {
  return (
    <HeaderContainer>
      <Title>Rifa Online 🎉</Title>
    </HeaderContainer>
  );
}

export default Header;