const { useState } = React;
const { Mic } = lucide;

function MatrizDinamicaApp() {
  // Estado para controlar si la app está desbloqueada
  const [isUnlocked, setIsUnlocked] = useState(false);
  // Estado para el código numérico
  const [numericCode, setNumericCode] = useState('');
  // Estado para la retroalimentación
  const [feedback, setFeedback] = useState('');
  
  // Código numérico secreto
  const secretCode = '3657';
  
  // Función para manejar el código numérico
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
  
  // Pantalla de entrada con calculadora
  const LockScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Calculadora</h1>
        
        {/* Display */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6 h-16 flex items-center justify-end">
          <span className="text-2xl text-white font-mono">{numericCode ? numericCode.replace(/./g, '•') : '0'}</span>
        </div>
        
        {/* Teclado numérico */}
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
              className={`p-4 rounded-xl text-xl font-semibold transition-all ${
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
        
        {/* Retroalimentación */}
        {feedback && <p className="text-center text-sm mt-4 text-red-400">{feedback}</p>}
      </div>
    </div>
  );
  
  // Tu app original de Matriz Dinámica
  const MatrizDinamica = () => {
    const initialNumbers = [
      [],
      ['', '01', '02', '03', '04', '05', '06', '07'],
      ['08', '09', '10', '11', '12', '13', '14', '15'],
      ['16', '17', '18', '19', '20', '21', '22', '23'],
      ['24', '25', '26', '27', '28', '29', '30', '31'],
      ['', '32', '33', '34', '35', '36', '0', '00']
    ];

    const [gridNumbers, setGridNumbers] = useState(initialNumbers);
    const [highlightedNumber, setHighlightedNumber] = useState(null);
    const [voiceMessage, setVoiceMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [mainFeedback, setMainFeedback] = useState('');

    const moveNumberToFirstRow = (number, rowIndex, colIndex) => {
      if (number === '') return;
      
      const newGridNumbers = JSON.parse(JSON.stringify(gridNumbers));
      const firstNumber = newGridNumbers[1][1];
      const selectedNumber = newGridNumbers[rowIndex][colIndex];
      
      const sequence = [];
      for (let row = 1; row < newGridNumbers.length; row++) {
        for (let col = 0; col < newGridNumbers[row].length; col++) {
          if (newGridNumbers[row][col] !== '') {
            sequence.push({
              row: row,
              col: col,
              value: newGridNumbers[row][col]
            });
          }
        }
      }
      
      const firstIndex = sequence.findIndex(item => item.row === 1 && item.col === 1);
      const selectedIndex = sequence.findIndex(item => item.row === rowIndex && item.col === colIndex);
      
      if (selectedIndex <= firstIndex) {
        return;
      }
      
      const valuesToShift = [];
      for (let i = firstIndex; i < selectedIndex; i++) {
        valuesToShift.push(sequence[i].value);
      }
      
      for (let i = firstIndex + 1; i <= selectedIndex; i++) {
        const pos = sequence[i];
        const newValue = valuesToShift[i - firstIndex - 1];
        newGridNumbers[pos.row][pos.col] = newValue;
      }
      
      newGridNumbers[1][1] = selectedNumber;
      setHighlightedNumber(selectedNumber);
      setGridNumbers(newGridNumbers);
      
      setMainFeedback(`Número ${selectedNumber} movido a la primera posición, reemplazando a ${firstNumber}`);
      setTimeout(() => setMainFeedback(''), 3000);
      
      const voiceInfo = generateVoiceMessage(newGridNumbers);
      setVoiceMessage(voiceInfo);
    };
    
    const generateVoiceMessage = (grid) => {
      const row1 = grid[1].filter(n => n !== '').join(', ');
      const row2 = grid[2].filter(n => n !== '').join(', ');
      const row3 = grid[3].filter(n => n !== '').join(', ');
      return `Filas actualizadas: Fila 1: ${row1}, Fila 2: ${row2}, Fila 3: ${row3}`;
    };

    const handleVoiceCommand = () => {
      setIsRecording(true);
      setMainFeedback('Escuchando comando de voz...');
      
      setTimeout(() => {
        setIsRecording(false);
        
        const allNumbers = [];
        for (let row = 1; row < gridNumbers.length; row++) {
          for (let col = 0; col < gridNumbers[row].length; col++) {
            if (gridNumbers[row][col] !== '' && !(row === 1 && col === 1)) {
              allNumbers.push({ value: gridNumbers[row][col], row, col });
            }
          }
        }
        
        if (allNumbers.length > 0) {
          const randomIndex = Math.floor(Math.random() * allNumbers.length);
          const selectedNumber = allNumbers[randomIndex];
          
          setMainFeedback(`Comando de voz: mover ${selectedNumber.value}`);
          moveNumberToFirstRow(selectedNumber.value, selectedNumber.row, selectedNumber.col);
        } else {
          setMainFeedback('No hay más números para mover');
        }
      }, 1500);
    };

    const resetGrid = () => {
      setGridNumbers(initialNumbers);
      setHighlightedNumber(null);
      setVoiceMessage('');
      setMainFeedback('Cuadrícula reiniciada');
      setTimeout(() => setMainFeedback(''), 2000);
    };

    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 min-h-screen overflow-hidden">
        <div className="w-full max-w-sm flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Matriz Dinámica</h1>
          <button
            onClick={() => {
              setIsUnlocked(false);
              setNumericCode('');
            }}
            className="px-4 py-2 bg-red-600/80 text-white rounded-lg text-sm"
          >
            Salir
          </button>
        </div>
        
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-3 mb-6 border border-white/20">
          <div className="bg-black/20 rounded-xl p-2">
            {gridNumbers.slice(1).map((row, rowIndex) => (
              <div key={rowIndex + 1} className="flex gap-1 mb-2 justify-center">
                {row.map((number, colIndex) => (
                  <button
                    key={colIndex}
                    onClick={() => number !== '' && moveNumberToFirstRow(number, rowIndex + 1, colIndex)}
                    className={`${
                      number !== '' 
                        ? rowIndex === 0 && colIndex === 1 && number === highlightedNumber
                          ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black transform scale-110 shadow-lg shadow-yellow-500/50' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:transform hover:scale-105'
                        : 'bg-transparent'
                    } 
                    w-10 h-10 flex items-center justify-center rounded-lg 
                    ${number !== '' ? 'shadow-lg font-bold text-sm border-2 border-white/30' : ''} 
                    transition-all duration-300 ease-in-out
                    ${number !== '' ? 'cursor-pointer' : 'cursor-default'}`}
                    disabled={number === ''}
                  >
                    {number}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={resetGrid}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 font-semibold text-sm"
          >
            Reiniciar
          </button>
          
          <div className="text-center">
            <button
              onClick={handleVoiceCommand}
              className={`p-4 rounded-full ${
                isRecording 
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 animate-ping' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
              } text-white shadow-xl transition-all duration-300 transform hover:scale-110`}
            >
              <Mic size={24} />
            </button>
            <p className="text-xs mt-2 text-white/80">{isRecording ? 'Grabando...' : 'Voz'}</p>
          </div>
        </div>
        
        {mainFeedback && (
          <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md text-white rounded-xl mb-4 w-full max-w-sm text-center shadow-lg border border-white/20 text-sm">
            {mainFeedback}
          </div>
        )}
        
        {voiceMessage && (
          <div className="p-4 bg-gradient-to-r from-gray-900/80 to-slate-900/80 backdrop-blur-md text-white rounded-xl w-full max-w-sm shadow-xl border border-white/20 text-sm">
            <p className="font-bold mb-2 text-purple-300">Salida de voz:</p>
            <p className="text-gray-100">{voiceMessage}</p>
          </div>
        )}
      </div>
    );
  };

  // Mostrar la pantalla correspondiente
  return isUnlocked ? <MatrizDinamica /> : <LockScreen />;
}

// Renderizar la aplicación
ReactDOM.render(<MatrizDinamicaApp />, document.getElementById('root'));
