import React from 'react';

const categories = [
  'Conference', 'Workshop', 'Seminar', 'Networking', 'Concert',
  'Exhibition', 'Sports', 'Festival', 'Charity', 'Other'
];

const CategorySelector = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:text-sm"
    >
      <option value="">Select category</option>
      {categories.map(category => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>
  );
};

export default CategorySelector;