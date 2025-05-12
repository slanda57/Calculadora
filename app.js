// Definir variables
const { useState } = React;

function App() {
  // Estado para controlar el desbloqueo y código
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [numericCode, setNumericCode] = useState('');
  const [feedback, setFeedback] = useState('');
  
  // Código de desbloqueo
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
  const renderCalculator = () => {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#111827',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '320px',
          backgroundColor: 'rgba(31, 41, 55, 0.5)',
          borderRadius: '1.5rem',
          padding: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>Calculadora</h1>
          
          <div style={{
            backgroundColor: '#111827',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            height: '4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
            <span style={{
              fontSize: '1.5rem',
              color: 'white',
              fontFamily: 'monospace'
            }}>{numericCode ? numericCode.replace(/./g, '•') : '0'}</span>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem'
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '='].map((key) => (
              <button
                key={key}
                onClick={() => {
                  if (key === 'C') {
                    setNumericCode('');
                    setFeedback('');
                  } else if (key !== '=') {
                    handleNumberTap(key.toString());
                  }
                }}
                style={{
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
                }}
              >
                {key}
              </button>
            ))}
          </div>
          
          {feedback && (
            <p style={{
              textAlign: 'center',
              fontSize: '0.875rem',
              marginTop: '1rem',
              color: '#F87171'
            }}>{feedback}</p>
          )}
        </div>
      </div>
    );
  };
  
  // Pantalla desbloqueada
  const renderUnlocked = () => {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1E3A8A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '320px',
          backgroundColor: '#1E40AF',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>Matriz Dinámica</h1>
          
          <p style={{
            textAlign: 'center',
            marginBottom: '1rem'
          }}>¡Pantalla desbloqueada correctamente!</p>
          
          <button
            onClick={() => {
              setIsUnlocked(false);
              setNumericCode('');
            }}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#DC2626',
              color: 'white',
              borderRadius: '0.75rem',
              textAlign: 'center',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Volver a bloquear
          </button>
        </div>
      </div>
    );
  };

  // Renderizar la pantalla correspondiente
  return isUnlocked ? renderUnlocked() : renderCalculator();
}

// Renderizar la aplicación
ReactDOM.render(<App />, document.getElementById('root'));
