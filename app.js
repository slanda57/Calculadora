const { useState } = React;

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [numericCode, setNumericCode] = useState('');
  const [feedback, setFeedback] = useState('');
  
  // Código secreto
  const secretCode = '3657';
  
  const handleNumberTap = (num) => {
    console.log('Número presionado:', num);
    const newCode = numericCode + num;
    setNumericCode(newCode);
    console.log('Código actual:', newCode);
    
    if (newCode.length === 4) {
      console.log('Verificando código:', newCode);
      if (newCode === secretCode) {
        console.log('¡Código correcto!');
        setIsUnlocked(true);
        setFeedback('');
      } else {
        console.log('Código incorrecto');
        setNumericCode('');
        setFeedback('Código incorrecto');
        setTimeout(() => setFeedback(''), 2000);
      }
    }
  };
  
  // Pantalla de calculadora
  const LockScreen = () => (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-800 rounded-xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Calculadora</h1>
        
        <div className="bg-gray-700 rounded-xl p-4 mb-6 h-16 flex items-center justify-end">
          <span className="text-2xl text-white font-mono">{numericCode ? numericCode.replace(/./g, '•') : '0'}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
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
              className={`p-4 rounded-xl text-xl font-semibold ${
                key === '=' 
                  ? 'bg-blue-600 text-white' 
                  : key === 'C'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        
        {feedback && <p className="text-center text-sm mt-4 text-red-400">{feedback}</p>}
      </div>
    </div>
  );
  
  // Pantalla desbloqueda
  const UnlockedScreen = () => (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-blue-800 rounded-xl p-6 shadow-xl text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Matriz Dinámica</h1>
        <p className="text-center mb-4">¡Pantalla desbloqueada correctamente!</p>
        <button
          onClick={() => {
            setIsUnlocked(false);
            setNumericCode('');
          }}
          className="w-full p-4 bg-red-600 text-white rounded-xl text-center"
        >
          Volver a bloquear
        </button>
      </div>
    </div>
  );

  return isUnlocked ? <UnlockedScreen /> : <LockScreen />;
}

ReactDOM.render(<App />, document.getElementById('root'));
