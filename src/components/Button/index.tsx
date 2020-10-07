import React, { ButtonHTMLAttributes } from 'react';

import { StyledButton } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, type, loading }) => {
  return (
    <StyledButton type={type}>
      {loading ? 'Carregando...' : children}
    </StyledButton>
  );
};

export default Button;
