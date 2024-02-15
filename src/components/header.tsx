import React from 'react'
import empresaLogo from '../assets/logo.png'

const Header: React.FC = () => {
    return (
      <header className="bg-none p-4">
        <img src={empresaLogo} alt="Logo da Empresa" className="h-16 w-auto" />
      </header>
    );
  };

export default Header
