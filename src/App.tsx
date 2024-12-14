import React, { useState, KeyboardEvent } from 'react';
import { Calculator } from 'lucide-react';
import { evaluateExpression } from './utils/parser';
import { formatCartesian, formatPolar } from './utils/complexMath';

function App() {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [isPolar, setIsPolar] = useState<boolean>(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState<boolean>(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Control') {
      setIsCtrlPressed(true);
    }
    
    if (isCtrlPressed && e.key === '<') {
      e.preventDefault();
      const cursorPos = e.currentTarget.selectionStart;
      const textBefore = input.substring(0, cursorPos);
      const textAfter = input.substring(cursorPos);
      setInput(textBefore + '∠' + textAfter);
    }
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Control') {
      setIsCtrlPressed(false);
    }
  };

  const calculate = () => {
    try {
      const complexResult = evaluateExpression(input);
      setResult(isPolar ? formatPolar(complexResult) : formatCartesian(complexResult));
    } catch (error) {
      setResult('Hatalı giriş! Lütfen ifadeyi kontrol edin.');
    }
  };

  const toggleFormat = () => {
    try {
      if (result && !result.includes('Hatalı')) {
        const complexResult = evaluateExpression(input);
        setIsPolar(!isPolar);
        setResult(!isPolar ? formatPolar(complexResult) : formatCartesian(complexResult));
      }
    } catch (error) {
      // Hata durumunda mevcut sonucu koruyoruz
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">Kompleks Sayı Hesaplayıcı</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İşleminizi Girin
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Örnek: (3+5i)*2 / (5 ∠ 60)"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">İpuçları:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Kartezyen form için: 3+5i</li>
              <li>Polar form için: 5 ∠ 60</li>
              <li>Açı sembolü (∠) için: Ctrl + &lt;</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={calculate}
              className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Hesapla
            </button>
            
            <button
              onClick={toggleFormat}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {isPolar ? 'Kartezyen Form' : 'Polar Form'}
            </button>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Sonuç ({isPolar ? 'Polar Form' : 'Kartezyen Form'}):
              </h2>
              <p className="text-lg text-purple-600 font-mono">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;