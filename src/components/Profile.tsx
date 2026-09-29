import About from './About';
import Qualities from './Qualities';

// Seção "Sobre" da home: apresentação (foto + texto) seguida do mix de
// números, trajetória e habilidades.
export default function Profile() {
  return (
    <>
      <About />
      <Qualities />
    </>
  );
}
