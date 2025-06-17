
import React from 'react';

interface DisplayProps {
  value: string;
}

const Display: React.FC<DisplayProps> = ({ value }) => {
  // Determine text size based on length to prevent overflow, a bit simplified
  let textSize = 'text-5xl'; // Default size
  if (value.length > 9 && value.length <= 12) {
    textSize = 'text-4xl';
  } else if (value.length > 12 && value.length <= 15) {
    textSize = 'text-3xl';
  } else if (value.length > 15) {
    textSize = 'text-2xl'; // Or even smaller / scroll
  }
  if (value === "Error") {
    textSize = 'text-4xl';
  }


  return (
    <div className="bg-black/75 border-4 border-red-900/50 p-4 mb-4 rounded-none shadow-inner shadow-black">
      <div 
        className={`w-full h-20 flex items-center justify-end font-['Press_Start_2P'] text-red-500 break-all ${textSize} overflow-hidden`}
        aria-label="Calculator display"
      >
        {value}
      </div>
    </div>
  );
};

export default Display;
