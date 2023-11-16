import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { notify, error, limitError } from '../assets/scripts/toasts';
import { assignInputFunctions, generatePIN, verifyPIN } from '../assets/scripts/verificationScripts';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Undo from '../assets/images/undo.svg';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/login.css';

export default function PINVerification() {
  document.title = 'Verificação de PIN';
  const navigate = useNavigate();
  let defaultPIN = generatePIN();
  let toastNotifyText = `Seu PIN é: ${defaultPIN}`;
  const toastErrorText = 'PIN inválido';
  const toastLimitErrorText = 'Suas tentativas acabaram';

  function regeneratePIN() {
    toast.dismiss();
    defaultPIN = generatePIN();
    toastNotifyText = `Seu novo PIN é: ${defaultPIN}`;
    notify(toastNotifyText);
  }
  
  useEffect(() => {
    notify(toastNotifyText);
    assignInputFunctions();
    const floatCard = document.getElementsByClassName('floatCard')[0];
    const form = document.getElementById('form');
    const attempts = document.getElementById('attempts');
    const regeneratePINButton = document.getElementById('regeneratePINButton');
    regeneratePINButton.addEventListener('click', regeneratePIN);
    
    function verifyPINError() {
      error(toastErrorText);
      attempts.innerText -= 1;
    }

    function attemptsLimitError() {
      toast.dismiss();
      error(toastErrorText);
      limitError(toastLimitErrorText);
      for (let input of floatCard.getElementsByTagName('input')) {
        input.disabled = true;
      }
      regeneratePINButton.removeEventListener('click', regeneratePIN);
      regeneratePINButton.addEventListener('click', () => {
        toast.dismiss();
        limitError(toastLimitErrorText);
      });
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let enteredPIN = '';
      const inputs = document.getElementsByClassName('pin-input');
      for (let input of inputs) {
        enteredPIN += input.value;
      }
      
      const verify = verifyPIN(enteredPIN, defaultPIN);
      if (verify) {
        navigate('/client');
      } else {
        verifyPINError();
        if (attempts.innerText == 0) {
          attemptsLimitError();
        }
        for (let input of inputs) {
          input.value = '';
        }
        inputs[0].focus();
      }
    });
  });

  return (
    <div className="body">
      <Header />
      <main>
        <div className="floatCard">
          <p>Informe o código recebido abaixo:</p>
          <form id="form">
            <div className="pin-container">
              <input className="pin-input" type="number" name="pin-1" autoComplete="off" inputMode="numeric" required />
              <input className="pin-input" type="number" name="pin-2" autoComplete="off" inputMode="numeric" required />
              <input className="pin-input" type="number" name="pin-3" autoComplete="off" inputMode="numeric" required />
              <input className="pin-input" type="number" name="pin-4" autoComplete="off" inputMode="numeric" required />
            </div>
            <input id="submit" type="submit" value="AVANÇAR" />
          </form>
          <div id="info">
            <p className="text-xs">Você possui <span className="span-red bold" id="attempts">5</span> tentativas restantes.</p>
            <p className="text-xs">Aguarde <span className="span-red bold" id="pin-delay">00:59</span> para pedir um novo código.</p>
            <p className="text-xs">Ainda não recebeu o código? Verifique a caixa de spam do seu e-mail ou escolha uma das opções a seguir:</p>
          </div>
          <button className="icon-button anchor" id="regeneratePINButton"><img src={Undo} alt="Reenviar" />REENVIAR CÓDIGO</button>
          <button className="icon-button anchor">RECEBER DE OUTRAS FORMAS</button>
        </div>
      </main>
      <ToastContainer />
      <Footer contactVisibility="hide"/>
    </div>
  );
}
