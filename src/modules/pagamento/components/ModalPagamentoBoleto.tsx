import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Plano } from '../types/pagamento.types';

interface ModalPagamentoBoletoProps {
  plano: Plano;
  isOpen: boolean;
  onClose: () => void;
  onPagamentoGerado: () => void;
}

// Animações
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: ${fadeIn} 0.3s ease-out;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} 0.4s ease-out;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 25px 30px;
  border-radius: 20px 20px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: 30px;
`;

const PlanoInfo = styled.div`
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 25px;
  border: 1px solid #e3ebf5;
  text-align: center;
`;

const PlanoNome = styled.h3`
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 1.3rem;
`;

const PlanoPreco = styled.div`
  font-size: 2.2rem;
  font-weight: bold;
  color: #28a745;
  margin-bottom: 10px;
  
  span {
    font-size: 1rem;
    color: #6c757d;
    font-weight: normal;
  }
`;

const PlanoDescricao = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 1rem;
`;

const BoletoContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

const BoletoInfo = styled.div`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 25px;
  border-radius: 20px;
  margin: 20px 0;
  box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
  animation: ${pulse} 3s infinite;
`;

const BoletoNumero = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 15px 0;
  padding: 15px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  word-break: break-all;
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

const VencimentoInfo = styled.div`
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
  padding: 15px;
  border-radius: 10px;
  margin: 15px 0;
  text-align: center;
  
  h4 {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
  }
  
  p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.9;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 15px 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
  }
`;

export const ModalPagamentoBoleto: React.FC<ModalPagamentoBoletoProps> = ({
  plano,
  isOpen,
  onClose,
  onPagamentoGerado
}) => {
  const [boletoGerado, setBoletoGerado] = useState(false);
  const [numeroBoleto, setNumeroBoleto] = useState('');
  const [boleto, setBoleto] = useState<GerarBoletoResponse | null>(null);

  useEffect(() => {
    if (isOpen && !boletoGerado) {
      gerarBoleto();
    }
  }, [isOpen]);

  const gerarBoleto = () => {
    // Simular geração de boleto
    const numero = `104${Date.now().toString().slice(-8)}0001234567890`;
    setNumeroBoleto(numero);
    setBoletoGerado(true);
  };

  const obterDataVencimento = () => {
    const hoje = new Date();
    const vencimento = new Date(hoje);
    vencimento.setDate(hoje.getDate() + 3); // 3 dias úteis
    return vencimento.toLocaleDateString('pt-BR');
  };

  const copiarCodigoBoleto = () => {
    const codigoBarras = gerarCodigoBarras();
    const linhaDigitavel = formatarLinhaDigitavel(codigoBarras);
    navigator.clipboard.writeText(linhaDigitavel);
    alert('Linha digitável do boleto copiada para a área de transferência!');
  };

  const gerarCodigoBarras = () => {
    // Gera código de barras completo para boleto bancário
    const banco = '104'; // Caixa Econômica Federal
    const moeda = '9'; // Real
    const dv = calcularDigitoVerificador();
    const vencimento = calcularCampoVencimento();
    const valor = String(9000).padStart(10, '0'); // R$ 90,00 em centavos
    const agencia = '4803';
    const conta = '000860463765';
    const dvConta = '4';
    const nossoNumero = String(Date.now()).slice(-8); // 8 últimos dígitos do timestamp
    
    const codigoCedente = `${agencia}${conta}${dvConta}${nossoNumero}`;
    
    return `${banco}${moeda}${dv}${vencimento}${valor}${codigoCedente}`;
  };

  const calcularDigitoVerificador = () => {
    // Simula cálculo do dígito verificador
    const timestamp = Date.now().toString();
    const soma = timestamp.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    return (soma % 11).toString();
  };

  const calcularCampoVencimento = () => {
    // Calcula campo de vencimento (dias desde 07/10/1997)
    const dataBase = new Date('1997-10-07');
    const hoje = new Date();
    const vencimento = new Date(hoje);
    vencimento.setDate(hoje.getDate() + 3); // 3 dias úteis
    
    const diffTime = vencimento.getTime() - dataBase.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return String(diffDays).padStart(4, '0');
  };

  const formatarLinhaDigitavel = (codigoBarras: string) => {
    // Converte o código de barras em linha digitável (formato padrão brasileiro)
    const campo1 = `${codigoBarras.substring(0, 4)}.${codigoBarras.substring(4, 9)}`;
    const campo2 = `${codigoBarras.substring(9, 14)}.${codigoBarras.substring(14, 20)}`;
    const campo3 = `${codigoBarras.substring(20, 25)}.${codigoBarras.substring(25, 31)}`;
    const campo4 = codigoBarras.substring(4, 5); // Dígito verificador
    const campo5 = codigoBarras.substring(5, 19); // Vencimento + Valor
    
    return `${campo1} ${campo2} ${campo3} ${campo4} ${campo5}`;
  };

  const gerarCodigoBarrasVisual = (codigo: string) => {
    // Gera representação visual do código de barras
    let barras = '';
    for (let i = 0; i < codigo.length; i++) {
      const digito = parseInt(codigo[i]);
      // Padrão de barras baseado no dígito
      switch (digito % 4) {
        case 0: barras += '█ '; break;
        case 1: barras += '▌▌ '; break;
        case 2: barras += '▌ '; break;
        case 3: barras += '██ '; break;
        default: barras += '▌ '; break;
      }
    }
    return barras;
  };

  const gerarBoletoParaImpressao = () => {
    const codigoBarras = gerarCodigoBarras();
    const linhaDigitavel = formatarLinhaDigitavel(codigoBarras);
    const codigoBarrasVisual = gerarCodigoBarrasVisual(codigoBarras);
    
    const dadosBoleto = {
      numeroDocumento: numeroBoleto,
      codigoBarras: codigoBarras,
      linhaDigitavel: linhaDigitavel,
      codigoBarrasVisual: codigoBarrasVisual,
      vencimento: obterDataVencimento(),
      valor: plano.preco,
      beneficiario: 'SSait Odonto Sistema Ltda',
      cnpjBeneficiario: '12.345.678/0001-90',
      banco: 'Caixa Econômica Federal',
      codigoBanco: '104',
      agencia: '4803',
      conta: '000860463765-4',
      pagador: 'Cliente SSait Odonto',
      plano: plano.nome,
      descricao: plano.descricao
    };

    gerarBoletoHTML(dadosBoleto);
  };

  const gerarBoletoHTML = (dados: any) => {
    const boletoHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boleto Bancário - SSait Odonto</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; font-size: 12px; }
        .boleto-container { max-width: 800px; margin: 0 auto; border: 2px solid #000; padding: 10px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .banco-info { display: flex; justify-content: space-between; margin-bottom: 15px; }
        .linha-digitavel { text-align: center; font-size: 14px; font-weight: bold; margin: 15px 0; 
                          border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9; }
        .dados-boleto { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .campo { margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .campo-label { font-weight: bold; font-size: 10px; color: #666; }
        .campo-valor { font-size: 12px; margin-top: 2px; }
        .valor-principal { font-size: 18px; font-weight: bold; text-align: right; }
        .codigo-barras { text-align: center; margin: 20px 0; font-family: 'Courier New', monospace; 
                        border: 2px solid #000; padding: 10px; background-color: #fff; }
        .codigo-barras-visual { font-size: 16px; line-height: 40px; letter-spacing: -1px; 
                              color: #000; background: #fff; }
        .instrucoes { margin-top: 20px; border-top: 2px solid #000; padding-top: 15px; }
        .corte { border-top: 2px dashed #666; margin: 30px 0; padding-top: 20px; text-align: center; }
        .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #666; }
        @media print { body { margin: 0; } .no-print { display: none; } }
        .btn-imprimir { background: #007bff; color: white; border: none; padding: 10px 20px; 
                       margin: 20px; border-radius: 5px; cursor: pointer; font-size: 14px; }
    </style>
</head>
<body>
    <button class="btn-imprimir no-print" onclick="window.print()">🖨️ Imprimir Boleto</button>
    
    <div class="boleto-container">
        <div class="header">
            <h2>BOLETO BANCÁRIO</h2>
            <p>SSait Odonto - Sistema de Gestão Odontológica</p>
        </div>

        <div class="banco-info">
            <div>
                <strong>${dados.banco}</strong><br>
                Código: ${dados.codigoBanco}
            </div>
            <div style="text-align: right;">
                <strong>Número do Documento</strong><br>
                ${dados.numeroDocumento}
            </div>
        </div>

        <div class="linha-digitavel">
            <div style="font-size: 11px; color: #666; margin-bottom: 5px;">LINHA DIGITÁVEL</div>
            ${dados.linhaDigitavel}
        </div>

        <div class="dados-boleto">
            <div>
                <div class="campo">
                    <div class="campo-label">BENEFICIÁRIO</div>
                    <div class="campo-valor">${dados.beneficiario}</div>
                </div>
                <div class="campo">
                    <div class="campo-label">CNPJ</div>
                    <div class="campo-valor">${dados.cnpjBeneficiario}</div>
                </div>
                <div class="campo">
                    <div class="campo-label">AGÊNCIA/CONTA</div>
                    <div class="campo-valor">${dados.agencia} / ${dados.conta}</div>
                </div>
                <div class="campo">
                    <div class="campo-label">PLANO CONTRATADO</div>
                    <div class="campo-valor">${dados.plano}</div>
                </div>
                <div class="campo">
                    <div class="campo-label">CÓDIGO DE BARRAS</div>
                    <div class="campo-valor" style="font-family: monospace; font-size: 10px;">${dados.codigoBarras}</div>
                </div>
            </div>
            <div>
                <div class="campo">
                    <div class="campo-label">PAGADOR</div>
                    <div class="campo-valor">${dados.pagador}</div>
                </div>
                <div class="campo">
                    <div class="campo-label">DATA DE VENCIMENTO</div>
                    <div class="campo-valor">${dados.vencimento}</div>
                </div>
                <div class="campo">
                    <div class="campo-label">VALOR DO DOCUMENTO</div>
                    <div class="campo-valor valor-principal">R$ ${dados.valor.toFixed(2)}</div>
                </div>
                <div class="campo">
                    <div class="campo-label">NOSSO NÚMERO</div>
                    <div class="campo-valor">${dados.numeroDocumento.slice(-10)}</div>
                </div>
            </div>
        </div>

        <div class="codigo-barras" style="background-color: #fff; color: #000; border: 1px solid #000;">
            <div style="font-size: 16px; margin-bottom: 12px; font-weight: bold; text-align: center;">CÓDIGO DE BARRAS</div>
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
              <div style="font-family: 'monospace'; font-size: 36px; letter-spacing: 4px; background: #fff; color: #111; padding: 8px 0; text-align: center; white-space: nowrap; max-width: 98%; overflow-x: auto; border-radius: 4px; box-sizing: border-box;">
                ${dados.codigoBarrasVisual}
              </div>
              <div style="font-size: 13px; margin-top: 4px; font-family: monospace; color: #333; letter-spacing: 1px; text-align: center; max-width: 98%; overflow-x: auto;">
                ${dados.codigoBarras}
              </div>
            </div>
        </div>

        <div class="instrucoes">
            <h4>INSTRUÇÕES DE PAGAMENTO</h4>
            <ul>
                <li>Pagamento válido até ${dados.vencimento}</li>
                <li>Pode ser pago em qualquer banco, casa lotérica ou internet banking</li>
                <li>Após o pagamento, aguarde até 2 dias úteis para confirmação</li>
                <li>Em caso de dúvidas, entre em contato com o suporte: (71) 9962-85453</li>
            </ul>
        </div>

        <div class="footer">
            <p>SSait Odonto - Sistema completo para consultórios odontológicos</p>
            <p>Este boleto foi gerado eletronicamente - ${new Date().toLocaleString('pt-BR')}</p>
        </div>
    </div>
    
    <script>
        // Auto-print quando abrir em nova janela
        window.onload = function() {
            if (window.location.href.includes('print=true')) {
                setTimeout(() => window.print(), 500);
            }
        }
    </script>
</body>
</html>`;

    // Abrir em nova janela para impressão
    const novaJanela = window.open('', '_blank');
    if (novaJanela) {
      novaJanela.document.write(boletoHTML);
      novaJanela.document.close();
    }
  };

  const confirmarPagamento = () => {
    onPagamentoGerado();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            🧾 Boleto Bancário
          </ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <ModalBody>
          <PlanoInfo>
            <PlanoNome>{plano.nome}</PlanoNome>
            <PlanoPreco>
              R$ {plano.preco.toFixed(2)}
              <span>/mês</span>
            </PlanoPreco>
            <PlanoDescricao>{plano.descricao}</PlanoDescricao>
          </PlanoInfo>

          <BoletoContainer>
            <BoletoInfo>
              <h3>🧾 Boleto Gerado com Sucesso!</h3>
              <p>Utilize o código abaixo para efetuar o pagamento</p>
              
              <BoletoNumero onClick={copiarCodigoBoleto} style={{ cursor: 'pointer' }}>
                {numeroBoleto}
                <div style={{ fontSize: '0.8rem', marginTop: '8px', opacity: 0.9 }}>
                  👆 Clique para copiar
                </div>
              </BoletoNumero>
            </BoletoInfo>

            <VencimentoInfo>
              <h4>⏰ Data de Vencimento</h4>
              <p>{obterDataVencimento()}</p>
            </VencimentoInfo>

            <ActionButton onClick={gerarBoletoParaImpressao}>
              🧾 Gerar Boleto para Impressão
            </ActionButton>
            
            <ActionButton 
              onClick={copiarCodigoBoleto}
              style={{ 
                marginTop: '10px',
                background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)' 
              }}
            >
              📋 Copiar Linha Digitável
            </ActionButton>
          </BoletoContainer>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

interface GerarBoletoRequest {
    valor: number;
}

interface GerarBoletoResponse {
    pdfUrl?: string;
    linhaDigitavel?: string;
    codigoBarras?: string;
    vencimento?: string;
    valor?: number;
    beneficiario?: string;
    cnpjBeneficiario?: string;
    banco?: string;
    codigoBanco?: string;
    agencia?: string;
    conta?: string;
    pagador?: string;
    plano?: string;
    descricao?: string;
    numeroDocumento?: string;
}

async function gerarBoletoProfissional(valor: number): Promise<GerarBoletoResponse> {
    const response = await fetch('http://localhost:3001/api/gerar-boleto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor } as GerarBoletoRequest)
    });
    const data: GerarBoletoResponse = await response.json();
    // Exiba o boleto, PDF, linha digitável, etc.
    return data;
}

// Exemplo de uso:

// Exemplo de uso:
// Mova o seguinte para dentro do componente ModalPagamentoBoleto:
// const [boleto, setBoleto] = useState<GerarBoletoResponse | null>(null);
// const handleGerarBoleto = async (plano: Plano) => {
//   if (!plano) return;
//   const boletoResponse = await gerarBoletoProfissional(plano.preco);
//   setBoleto(boletoResponse);
//   if (boletoResponse.pdfUrl) {
//     window.open(boletoResponse.pdfUrl, '_blank');
//   } else {
//     // Exiba mensagem de erro ou dados alternativos
//   }
// }