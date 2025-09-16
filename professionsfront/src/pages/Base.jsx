import React, { useState } from "react";

const fields = [
  "Software Developer",
  "DevOps Engineer",
  "Data Analytics",
  "Data Science",
  "AI",
  "Music",
  "F1",
  "Football",
  "Badminton",
  "Dance",
  "Photography",
  "Design",
  "Entrepreneurship",
  "Marketing",
];

const Base = () => {
  const [selectedFields, setSelectedFields] = useState([]);

  const toggleField = (field) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleSubmit = () => {
    console.log("Selected Fields:", selectedFields);
    // You can send selectedFields to backend here
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Choose Your Fields of Interest
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {fields.map((field, index) => (
          <button
            key={index}
            onClick={() => toggleField(field)}
            className={`p-4 rounded-xl border-2 font-medium transition ${
              selectedFields.includes(field)
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {field}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-8 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
      >
        Save & Continue
      </button>
    </div>
  );
};

export default Base;
