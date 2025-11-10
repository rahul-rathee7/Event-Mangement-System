import React, { useState } from 'react';

const TicketOptionsEditor = ({ isFree, onChange }) => {
  const [options, setOptions] = useState([
    { name: 'Standard', price: isFree ? 0 : 10, quantity: 100 }
  ]);

  const addOption = () => {
    const newOptions = [...options, { name: '', price: isFree ? 0 : 0, quantity: 0 }];
    setOptions(newOptions);
    onChange(newOptions);
  };

  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <div key={index} className="flex flex-wrap gap-2">
          <input
            type="text"
            value={option.name}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index].name = e.target.value;
              setOptions(newOptions);
              onChange(newOptions);
            }}
            placeholder="Ticket name"
            className="w-full py-2 pl-3 sm:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
          />
          {!isFree && (
            <input
              type="number"
              value={option.price}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index].price = Number(e.target.value);
                setOptions(newOptions);
                onChange(newOptions);
              }}
              placeholder="Price"
              className="w-full py-2 pl-3 sm:w-1/4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
            />
          )}
          <input
            type="number"
            value={option.quantity}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index].quantity = Number(e.target.value);
              setOptions(newOptions);
              onChange(newOptions);
            }}
            placeholder="Quantity"
            className="w-full py-2 pl-3 sm:w-1/4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addOption}
        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        + Add ticket type
      </button>
    </div>
  );
};

export default TicketOptionsEditor;