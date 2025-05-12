const { useState } = React;

function App() {
  // Estados
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [numericCode, setNumericCode] = useState('');
  const [feedback, setFeedback] = useState('');
  
  // Código secreto
  const secretCode = '3657';
  
  // Manejar entrada de números
  const handleNumberTap = (num) => {
    const newCode = numericCode + num;
    setNumericCode(newCode);
    
    if (newCode.length === 4) {
      if (newCode === secretCode) {
        setIsUnlocked(true);
        setFeedback('');
      } else {
        setNumericCode('');
        setFeedback('Código incorrecto');
        setTimeout(() => setFeedback(''), 2000);
      }
    }
  };
  
  // Pantalla de calculadora
  const Calculator = () => {
    return React.createElement('div', {
      style: {
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #111827, #000000)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }
    },
      React.createElement('div', {
        style: {
          width: '100%',
          maxWidth: '320px',
          backgroundColor: 'rgba(31, 41, 55, 0.5)',
          borderRadius: '1.5rem',
          padding: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }
      },
        React.createElement('h1', {
          style: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }
        }, "Calculadora"),
        
        React.createElement('div', {
          style: {
            backgroundColor: '#111827',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            height: '4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }
        },
          React.createElement('span', {
            style: {
              fontSize: '1.5rem',
              color: 'white',
              fontFamily: 'monospace'
            }
          }, numericCode ? numericCode.replace(/./g, '•') : '0')
        ),
        
        React.createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem'
          }
        },
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '='].map((key) =>
            React.createElement('button', {
              key: key,
              onClick: () => {
                if (key === 'C') {
                  setNumericCode('');
                  setFeedback('');
                } else if (key !== '=') {
                  handleNumberTap(key.toString());
                }
              },
              style: {
                padding: '1rem',
                borderRadius: '0.75rem',
                fontSize: '1.25rem',
                fontWeight: '600',
                backgroundColor: key === '=' 
                  ? '#2563EB' 
                  : key === 'C'
                  ? '#DC2626'
                  : '#374151',
                color: 'white',
                cursor: 'pointer',
                border: 'none'
              }
            }, key)
          )
        ),
        
        feedback && React.createElement('p', {
          style: {
            textAlign: 'center',
            fontSize: '0.875rem',
            marginTop: '1rem',
            color: '#F87171'
          }
        }, feedback)
      )
    );
  };
  
  // Pantalla de matriz dinámica simplificada
  const MatrixScreen = () => {
    const [message, setMessage] = useState('¡Pantalla desbloqueada correctamente!');
    
    return React.createElement('div', {
      style: {
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #1E3A8A, #4F46E5, #7E22CE)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }
    },
      React.createElement('div', {
        style: {
          width: '100%',
          maxWidth: '320px',
          backgroundColor: '#2563EB',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }
      },
        React.createElement('h1', {
          style: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem',
            textAlign: 'center'
          }
        }, "Matriz Dinámica"),
        
        React.createElement('p', {
          style: {
            color: 'white',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }
        }, message),
        
        React.createElement('button', {
          onClick: () => {
            setIsUnlocked(false);
            setNumericCode('');
          },
          style: {
            padding: '0.75rem 1.5rem',
            backgroundColor: '#DC2626',
            color: 'white',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer'
          }
        }, "Volver a bloquear")
      )
    );
  };

  // Renderizar pantalla correspondiente
  return isUnlocked ? 
    React.createElement(MatrixScreen) : 
    React.createElement(Calculator);
}

// Renderizar la aplicación
ReactDOM.render(React.createElement(App), document.getElementById('root'));
