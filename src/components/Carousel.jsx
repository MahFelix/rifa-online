import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image1 from '../assets/1.png'
import Image2 from '../assets/2.png'
import Image3 from '../assets/3.png'
import Image4 from '../assets/4.png'

// Estilos para o carrossel
const CarouselContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
`;

const ImageContainer = styled.div`
  display: flex !important; /* Importante para o react-slick */
  justify-content: center;
  align-items: center;
  height: 300px; /* Ajuste o tamanho conforme necessário */
  overflow: hidden;
  border-radius: 10px;
  transition: transform 0.5s ease-in-out; /* Adiciona transição suave */
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.5s ease-in-out; /* Adiciona transição suave */
`;

// Estilos personalizados para os pontos (dots)
const CustomDots = styled.ul`
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 20px 0 0 0;

  li {
    margin: 0 5px;
    button {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #ccc;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #333;
      }
    }

    &.slick-active button {
      background-color: #333;
    }
  }
`;

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true, // Mostrar setas de navegação
    fade: false, // Desativar efeito fade para transição lateral
    cssEase: "ease-in-out", // Adiciona animação suave
    appendDots: (dots) => <CustomDots>{dots}</CustomDots>, // Usar dots personalizados
    responsive: [
      {
        breakpoint: 768, // Ajustes para telas menores
        settings: {
          arrows: false, // Esconder setas em telas pequenas
        },
      },
    ],
  };

  return (
    <CarouselContainer>
      <Slider {...settings}>
        <ImageContainer>
          <Image src={Image1} alt="Imagem 1" />
        </ImageContainer>
        <ImageContainer>
          <Image src={Image2} alt="Imagem 2" />
        </ImageContainer>
        <ImageContainer>
          <Image src={Image3} alt="Imagem 3" />
        </ImageContainer>
        <ImageContainer>
          <Image src={Image4} alt="Imagem 4" />
        </ImageContainer>
      </Slider>
    </CarouselContainer>
  );
};

export default Carousel;