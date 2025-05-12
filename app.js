const { useState } = React;

// Función auxiliar para evitar problemas de caché
const noCacheParam = `?nocache=${Date.now()}`;

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
  
  // Matriz Dinámica con toda la funcionalidad
  const MatrixScreen = () => {
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
      
      const row1 = newGridNumbers[1].filter(n => n !== '').join(', ');
      const row2 = newGridNumbers[2].filter(n => n !== '').join(', ');
      const row3 = newGridNumbers[3].filter(n => n !== '').join(', ');
      setVoiceMessage(`Filas actualizadas: Fila 1: ${row1}, Fila 2: ${row2}, Fila 3: ${row3}`);
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

    // Función auxiliar para determinar si un número debe ser resaltado
    const shouldHighlight = (rowIndex, colIndex, number) => {
      return rowIndex === 0 && colIndex === 1 && number === highlightedNumber;
    };

    // Crear un componente para representar un botón de la matriz
    const createMatrixButton = (number, rowIndex, colIndex) => {
      const highlighted = shouldHighlight(rowIndex, colIndex, number);
      
      return React.createElement('button', {
        key: colIndex,
        onClick: () => number !== '' && moveNumberToFirstRow(number, rowIndex + 1, colIndex),
        style: {
          width: '2.5rem',
          height: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.5rem',
          backgroundColor: number !== '' 
            ? highlighted
              ? '#F59E0B' 
              : '#3B82F6'
            : 'transparent',
          color: highlighted ? 'black' : 'white',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          border: number !== '' ? '2px solid rgba(255, 255, 255, 0.3)' : 'none',
          boxShadow: number !== '' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
          transform: highlighted ? 'scale(1.1)' : 'none',
          transition: 'all 0.3s ease',
          cursor: number !== '' ? 'pointer' : 'default'
        },
        disabled: number === ''
      }, number);
    };

    // Crear la interfaz completa de la matriz dinámica
    return React.createElement('div', {
      style: {
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #1E3A8A, #4F46E5, #7E22CE)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflow: 'hidden'
      }
    }, [
      // Encabezado con título y botón de salir
      React.createElement('div', {
        key: 'header',
        style: {
          width: '100%',
          maxWidth: '320px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }
      }, [
        React.createElement('h1', {
          key: 'title',
          style: {
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: 'white'
          }
        }, "Matriz Dinámica"),
        
        React.createElement('button', {
          key: 'exit',
          onClick: () => {
            setIsUnlocked(false);
            setNumericCode('');
          },
          style: {
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(220, 38, 38, 0.8)',
            color: 'white',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer'
          }
        }, "Salir")
      ]),
      
      // Cuadrícula de números
      React.createElement('div', {
        key: 'grid',
        style: {
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1rem',
          padding: '0.75rem',
          marginBottom: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }
      },
        React.createElement('div', {
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '0.75rem',
            padding: '0.5rem'
          }
        },
          gridNumbers.slice(1).map((row, rowIndex) =>
            React.createElement('div', {
              key: rowIndex,
              style: {
                display: 'flex',
                gap: '0.25rem',
                marginBottom: '0.5rem',
                justifyContent: 'center'
              }
            },
              row.map((number, colIndex) => 
                createMatrixButton(number, rowIndex, colIndex)
              )
            )
          )
        )
      ),
      
      // Botones de control
      React.createElement('div', {
        key: 'controls',
        style: {
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem'
        }
      }, [
        React.createElement('button', {
          key: 'reset',
          onClick: resetGrid,
          style: {
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(to right, #10B981, #059669)',
            color: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            fontWeight: '600',
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }
        }, "Reiniciar"),
        
        React.createElement('div', {
          key: 'voice',
          style: { textAlign: 'center' }
        }, [
          React.createElement('button', {
            key: 'voice-button',
            onClick: handleVoiceCommand,
            style: {
              padding: '1rem',
              borderRadius: '9999px',
              background: isRecording 
                ? 'linear-gradient(to right, #EF4444, #EC4899)'
                : 'linear-gradient(to right, #3B82F6, #4F46E5)',
              color: 'white',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }
          },
            React.createElement('svg', {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            }, [
              React.createElement('path', {
                key: 'path1',
                d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
              }),
              React.createElement('path', {
                key: 'path2',
                d: "M19 10v2a7 7 0 0 1-14 0v-2"
              }),
              React.createElement('line', {
                key: 'line1',
                x1: "12", y1: "19", x2: "12", y2: "23"
              }),
              React.createElement('line', {
                key: 'line2',
                x1: "8", y1: "23", x2: "16", y2: "23"
              })
            ])
          ),
          React.createElement('p', {
            key: 'voice-label',
            style: {
              fontSize: '0.75rem',
              marginTop: '0.5rem',
              color: 'rgba(255, 255, 255, 0.8)'
            }
          }, isRecording ? 'Grabando...' : 'Voz')
        ])
      ]),
      
      // Mensajes de retroalimentación
      mainFeedback && React.createElement('div', {
        key: 'feedback',
        style: {
          padding: '0.75rem',
          background: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(124, 58, 237, 0.2))',
          backdropFilter: 'blur(8px)',
          color: 'white',
          borderRadius: '0.75rem',
          marginBottom: '1rem',
          width: '100%',
          maxWidth: '320px',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '0.875rem'
        }
      }, mainFeedback),
      
      voiceMessage && React.createElement('div', {
        key: 'voice-message',
        style: {
          padding: '1rem',
          background: 'linear-gradient(to right, rgba(31, 41, 55, 0.8), rgba(30, 58, 138, 0.8))',
          backdropFilter: 'blur(8px)',
          color: 'white',
          borderRadius: '0.75rem',
          width: '100%',
          maxWidth: '320px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '0.875rem'
        }
      }, [
        React.createElement('p', {
          key: 'voice-title',
          style: {
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: '#C4B5FD'
          }
        }, "Salida de voz:"),
        React.createElement('p', {
          key: 'voice-content',
          style: { color: '#F9FAFB' }
        }, voiceMessage)
      ])
    ]);
  };

  // Renderizar pantalla correspondiente
  return isUnlocked ? 
    React.createElement(MatrixScreen) : 
    React.createElement(Calculator);
}

// Renderizar la aplicación - nota la etiqueta noCacheParam para evitar problemas de caché
ReactDOM.render(React.createElement(App), document.getElementById('root'));

// Forzar una recarga después de cierto tiempo si detectamos problemas
window.addEventListener('load', function() {
  // Si después de 2 segundos no hay elementos visibles, recargar la página
  setTimeout(function() {
    if (document.body.childElementCount === 1 && document.getElementById('root').childElementCount === 0) {
      window.location.reload(true);
    }
  }, 2000);
});
