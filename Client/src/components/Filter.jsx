import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

//fetch filter data from the server

const Filter = ({
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [statuses, setStatuses] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3434//api/roadmap/filters"
        );
        if (res.data.success) {
          setStatuses(res.data.status);
          setCategories(res.data.category);
        }
      } catch (error) {
        console.error("error fetching filters:", error);
      }
    };
    fetchFilters();
  }, []);

  return (
    <section className="mb-10">
      <div className="flex gap-4 items-center">
        <div className="font-medium px-10">Filter by:</div>

        {/* Status Dropdown */}
        <select
          className="border border-gray-300 px-3 py-2 rounded-3xl text-sm outline-none focus:border-gray-400"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">Status</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </select>

        {/* Category Dropdown */}
        <select
          className="border border-gray-300 px-3 py-2 rounded-2xl text-sm outline-none focus:border-gray-400"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
          }}
        >
          <option value="">Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default Filter;
