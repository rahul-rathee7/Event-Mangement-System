import React, { useState, useEffect } from 'react';

const TicketOptionsEditor = ({ isFree, onChange, initialOptions, ticketprice }) => {
  const [options, setOptions] = useState(initialOptions || [
    { name: 'Standard', price: isFree ? 0 : ticketprice, quantity: 100 }
  ]);

  useEffect(() => {
    if (isFree) {
      const newOptions = options.map(option => ({ ...option, price: 0 }));
      setOptions(newOptions);
      onChange(newOptions);
    }
  }, [isFree]);

  const handleOptionChange = (index, field, value) => {
    const newOptions = options.map((option, i) => {
      if (i === index) {
        const processedValue = (field === 'price' || field === 'quantity') ? Number(value) : value;
        return { ...option, [field]: processedValue };
      }
      return option;
    });
    setOptions(newOptions);
    onChange(newOptions);
  };

  const addOption = () => {
    const newOptions = [...options, { name: '', price: isFree ? 0 : 0, quantity: 0 }];
    setOptions(newOptions);
    onChange(newOptions);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    onChange(newOptions);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ticket Options</label>
      {options.map((option, index) => (
        <div key={index} className="flex flex-wrap items-center gap-2 p-2 border rounded-md dark:border-gray-700">
          <div className="flex-grow">
            <input
              type="text"
              value={option.name}
              onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
              placeholder="Ticket name (e.g., General Admission)"
              className="w-full py-2 pl-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
            />
          </div>
          {!isFree && (
            <div className="w-full sm:w-auto">
              <input
                type="number"
                value={option.price}
                onChange={(e) => handleOptionChange(index, 'price', e.target.value)}
                placeholder="Price"
                className="w-full py-2 pl-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
                min="0"
              />
            </div>
          )}
          <div className="w-full sm:w-auto">
            <input
              type="number"
              value={option.quantity}
              onChange={(e) => handleOptionChange(index, 'quantity', e.target.value)}
              placeholder="Quantity"
              className="w-full py-2 pl-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
              min="0"
            />
          </div>
          {options.length > 1 && (
             <button
                type="button"
                onClick={() => removeOption(index)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                aria-label="Remove ticket option"
              >
                Remove
              </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addOption}
        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        + Add another ticket type
      </button>
    </div>
  );
};

export default TicketOptionsEditor;