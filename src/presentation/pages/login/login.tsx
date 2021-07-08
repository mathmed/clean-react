import React, { useState, useEffect } from "react";
import Styles from "./login-styles.scss";
import Header from "@/presentation/components/login-header/login-header";
import Footer from "@/presentation/components/footer/footer";
import Input from "@/presentation/components/input/input";
import FormStatus from "@/presentation/components/form-status/form-status";
import Context from "@/presentation/contexts/form/form-context";
import { Validation } from "@/presentation/contracts/validation";

type Props = {
  validation: Validation;
};

const Login: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    email: "",
    password: "",
    errorMessage: "",
    emailError: "",
    passwordError: "",
    mainError: ""
  });

  useEffect(() => {
    setState({
      ...state,
      emailError: validation.validade("email", state.email),
      passwordError: validation.validade("password", state.password)
    });
  }, [state.email, state.password]);

  return (
    <div className={Styles.login}>
      <Header />
      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="Digite seu email" />
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />
          <button
            disabled
            data-testid="submit"
            className={Styles.submit}
            type="submit"
          >
            Entrar
          </button>
          <span className={Styles.link}>Criar conta</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  );
};

export default Login;
