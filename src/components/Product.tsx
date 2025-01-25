import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Puff } from "react-loader-spinner";

interface Product {
  id: number;
  attributes: {
    title: string;
    image: string;
    price: number;
  };
}

interface FilterMeta {
  categories?: string[];
  companies?: string[];
}

interface Filters {
  price: number;
  search: string;
  category: string;
  company: string;
  order: string;
}

const Product: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    price: 1000,
    search: "",
    category: "all",
    company: "all",
    order: "a-z",
  });
  const [filterMeta, setFilterMeta] = useState<FilterMeta>({});
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("theme") === "dark"
  ); // Foydalanuvchi tanlovini saqlash
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    // Dark/light rejimni classList yordamida qo'llash
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const fetchProducts = (query: string = "") => {
    setLoading(true);
    axios
      .get(`https://strapi-store-server.onrender.com/api/products${query}`)
      .then((response) => {
        if (response.status === 200) {
          setProducts(response.data.data || []);
          setFilterMeta(response.data.meta || {});
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleFilterChange = (field: keyof Filters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = `?search=${filters.search}&category=${filters.category}&company=${filters.company}&order=${filters.order}&price_lte=${filters.price}`;
    fetchProducts(query);
  };

  const handleReset = () => {
    setFilters({
      price: 1000,
      search: "",
      category: "all",
      company: "all",
      order: "a-z",
    });
    fetchProducts();
  };

  const handleRedirect = (product: Product) => {
    if (product.id) {
      navigate(`/details/${product.id}`);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <header className="w-full p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product List</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-800 text-black dark:text-white hover:opacity-80 transition"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      <form
        onSubmit={handleSearch}
        className="max-w-[1100px] w-full mx-auto my-[50px] flex flex-col gap-[30px] p-[30px] bg-gray-200 dark:bg-gray-800 rounded-lg"
      >
        <div className="flex justify-between gap-[20px]">
          <label className="flex flex-col w-[23%] gap-[7px] text-[16px]" htmlFor="product">
            Search Product
            <input
              id="product"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-lg py-[5px] px-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
              type="text"
            />
          </label>

          <label className="flex flex-col w-[23%] gap-[7px] text-[16px]">
            Select Category
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-lg py-[5px] px-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="all">All</option>
              {filterMeta.categories?.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col w-[23%] gap-[7px] text-[16px]">
            Select Company
            <select
              value={filters.company}
              onChange={(e) => handleFilterChange("company", e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-lg py-[5px] px-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="all">All</option>
              {filterMeta.companies?.map((company, index) => (
                <option key={index} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col w-[23%] gap-[7px] text-[16px]">
            Sort By
            <select
              value={filters.order}
              onChange={(e) => handleFilterChange("order", e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-lg py-[5px] px-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="a-z">a-z</option>
              <option value="z-a">z-a</option>
              <option value="high">High Price</option>
              <option value="low">Low Price</option>
            </select>
          </label>
        </div>

        <div className="flex justify-between items-center gap-[20px]">
          <div className="flex flex-col gap-3 max-w-[240px] w-full">
            <label htmlFor="price" className="flex justify-between items-center">
              <span>Select Price</span>
              <span>${filters.price.toFixed(2)}</span>
            </label>
            <input
              id="price"
              type="range"
              min="0"
              max="1000"
              value={filters.price}
              onChange={(e) => handleFilterChange("price", Number(e.target.value))}
              className="range range-secondary range-sm"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:opacity-80 transition"
          >
            SEARCH
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:opacity-80 transition"
          >
            RESET
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Puff visible={true} height={80} width={80} color="#fff" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-[1100px] w-full mx-auto py-12">
          {products.length === 0 ? (
            <p className="text-2xl text-center">No products found.</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleRedirect(product)}
                className="shadow-xl hover:shadow-2xl transition cursor-pointer p-4 rounded-2xl"
              >
                <img
                  src={product.attributes.image}
                  alt={product.attributes.title}
                  className="rounded-xl h-64 w-full object-cover"
                />
                <div className="text-center mt-4">
                  <h3 className="capitalize font-medium text-lg">
                    {product.attributes.title}
                  </h3>
                  <p className="text-pink-400">${product.attributes.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Product;
