
import React, { useState, useCallback } from 'react';
import Display from './components/Display';
import Button from './components/Button';
import { OperatorType } from './types';

const MAX_DISPLAY_LENGTH = 16; // Max characters on display

const App: React.FC = () => {
  const [currentValue, setCurrentValue] = useState<string>("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<OperatorType | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState<boolean>(false);

  const formatNumberForDisplay = (numStr: string): string => {
    if (numStr === "Error") return "Error";
    const num = parseFloat(numStr);
    if (isNaN(num)) return "Error"; // Should not happen with current logic but good guard
    
    let str = String(num);
    if (str.length > MAX_DISPLAY_LENGTH) {
      if (Math.abs(num) > 1e15 || (Math.abs(num) < 1e-4 && num !== 0)) { // Use scientific for very large/small
        str = num.toExponential(MAX_DISPLAY_LENGTH - 6); // Adjust precision for "e+XX"
      } else { // Truncate/round fixed point
        const decimalPointIndex = str.indexOf('.');
        if (decimalPointIndex !== -1) {
          const allowedFractionDigits = MAX_DISPLAY_LENGTH - decimalPointIndex -1;
          str = num.toFixed(Math.max(0, allowedFractionDigits));
        }
        // If still too long (e.g. very large integer part), then it's an issue
         if (str.length > MAX_DISPLAY_LENGTH) str = "Error"; // Or implement scrolling
      }
    }
     // Final check, if it became "NaN" due to formatting
    if (str === "NaN") return "Error";
    return str.slice(0, MAX_DISPLAY_LENGTH);
  };
  

  const handleNumber = useCallback((digit: string) => {
    if (currentValue === "Error") {
      setCurrentValue(digit);
      return;
    }
    if (shouldResetDisplay) {
      setCurrentValue(digit);
      setShouldResetDisplay(false);
    } else {
      if (currentValue.length < MAX_DISPLAY_LENGTH) {
        setCurrentValue(currentValue === "0" ? digit : currentValue + digit);
      }
    }
  }, [currentValue, shouldResetDisplay]);

  const handleDecimal = useCallback(() => {
    if (currentValue === "Error") {
      setCurrentValue("0.");
      return;
    }
    if (shouldResetDisplay) {
      setCurrentValue("0.");
      setShouldResetDisplay(false);
    } else if (!currentValue.includes(".")) {
       if (currentValue.length < MAX_DISPLAY_LENGTH -1) { // ensure space for '.' and at least one digit
        setCurrentValue(currentValue + ".");
       }
    }
  }, [currentValue, shouldResetDisplay]);

  const calculate = (): string => {
    if (!operator || previousValue === null) return currentValue;
    
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);

    if (isNaN(prev) || isNaN(current)) return "Error";

    let result: number;
    switch (operator) {
      case OperatorType.ADD:
        result = prev + current;
        break;
      case OperatorType.SUBTRACT:
        result = prev - current;
        break;
      case OperatorType.MULTIPLY:
        result = prev * current;
        break;
      case OperatorType.DIVIDE:
        if (current === 0) return "Error";
        result = prev / current;
        break;
      default:
        return "Error"; // Should be unreachable
    }
    return formatNumberForDisplay(String(result));
  };

  const handleOperator = useCallback((op: OperatorType) => {
    if (currentValue === "Error") { 
      // Allow starting new calculation from error if AC was not pressed
      // This is a choice, could also force AC.
      // Let's force AC for simplicity / less weird states.
      return;
    }

    if (operator !== null && previousValue !== null && !shouldResetDisplay) {
      const result = calculate();
      setCurrentValue(result);
      setPreviousValue(result === "Error" ? null : result);
    } else {
      setPreviousValue(currentValue);
    }
    
    setOperator(op);
    setShouldResetDisplay(true);
  }, [currentValue, operator, previousValue, shouldResetDisplay]); // calculate is not added as it's stable based on current component scope values

  const handleEquals = useCallback(() => {
    if (currentValue === "Error" || operator === null || previousValue === null) {
      return;
    }
    const result = calculate();
    setCurrentValue(result);
    setPreviousValue(null);
    setOperator(null);
    setShouldResetDisplay(true);
  }, [currentValue, operator, previousValue]); // calculate is not added

  const handleClear = useCallback(() => {
    setCurrentValue("0");
    setPreviousValue(null);
    setOperator(null);
    setShouldResetDisplay(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (currentValue === "Error" || shouldResetDisplay) {
      // If error or display should be reset (e.g. after operator), backspace acts like clear for current input
      // Or simply do nothing for shouldResetDisplay = true
      // Let's make it clear the current input if it was an error
      if (currentValue === "Error") handleClear();
      return;
    }
    if (currentValue.length === 1) {
      setCurrentValue("0");
    } else {
      setCurrentValue(currentValue.slice(0, -1));
    }
  }, [currentValue, shouldResetDisplay, handleClear]);
  
  const displayVal = (currentValue === "Error" || (shouldResetDisplay && previousValue !== null && operator !== null)) 
                     ? (operator && previousValue !== null ? formatNumberForDisplay(previousValue) : currentValue) 
                     : formatNumberForDisplay(currentValue);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto bg-stone-800/90 p-4 sm:p-6 shadow-2xl shadow-red-900/50 border-4 border-red-800 rounded-none">
        <h1 className="text-2xl sm:text-3xl text-red-500 font-['Press_Start_2P'] text-center mb-4_tracking-wider">DOOMSLAYER CALCULATOR</h1>
        <Display value={displayVal} />
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <Button label="AC" onClick={handleClear} variant="action" className="col-span-2 text-red-400" ariaLabel="All Clear"/>
          <Button label="DEL" onClick={handleBackspace} variant="action" className="text-red-400" ariaLabel="Delete"/>
          <Button label="/" onClick={() => handleOperator(OperatorType.DIVIDE)} variant="operator" ariaLabel="Divide"/>

          <Button label="7" onClick={() => handleNumber("7")} variant="number" />
          <Button label="8" onClick={() => handleNumber("8")} variant="number" />
          <Button label="9" onClick={() => handleNumber("9")} variant="number" />
          <Button label="*" onClick={() => handleOperator(OperatorType.MULTIPLY)} variant="operator" ariaLabel="Multiply"/>

          <Button label="4" onClick={() => handleNumber("4")} variant="number" />
          <Button label="5" onClick={() => handleNumber("5")} variant="number" />
          <Button label="6" onClick={() => handleNumber("6")} variant="number" />
          <Button label="-" onClick={() => handleOperator(OperatorType.SUBTRACT)} variant="operator" ariaLabel="Subtract"/>
          
          <Button label="1" onClick={() => handleNumber("1")} variant="number" />
          <Button label="2" onClick={() => handleNumber("2")} variant="number" />
          <Button label="3" onClick={() => handleNumber("3")} variant="number" />
          <Button label="+" onClick={() => handleOperator(OperatorType.ADD)} variant="operator" ariaLabel="Add"/>

          <Button label="0" onClick={() => handleNumber("0")} variant="number" className="col-span-2"/>
          <Button label="." onClick={handleDecimal} variant="number" ariaLabel="Decimal"/>
          <Button label="=" onClick={handleEquals} variant="equals" ariaLabel="Equals"/>
        </div>
         <p className="text-center text-xs text-stone-500 mt-6 font-['Press_Start_2P']">Rip and Tear... Your Math Problems!</p>
      </div>
    </div>
  );
};

export default App;
