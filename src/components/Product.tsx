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
    category?: string;
    company?: string;
  };
}

interface FilterMeta {
  categories?: string[];
  companies?: string[];
}

interface Pagination {
  page: number;
  pageCount: number;
  total: number;
}

const Product: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<{
    price: number;
    search: string;
    category: string;
    company: string;
    order: string;
  }>({
    price: 1000,
    search: "",
    category: "all",
    company: "all",
    order: "a-z",
  });
  const [filterMeta, setFilterMeta] = useState<FilterMeta>({});
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageCount: 1,
    total: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [pagination.page]);

  const fetchProducts = (query: string = "") => {
    setLoading(true);
    axios
      .get(
        `https://strapi-store-server.onrender.com/api/products?pagination[page]=${pagination.page}${query}`
      )
      .then((response) => {
        if (response.status === 200) {
          setProducts(response.data.data || []);
          setFilterMeta(response.data.meta || {});
          setPagination({
            page: response.data.meta.pagination.page,
            pageCount: response.data.meta.pagination.pageCount,
            total: response.data.meta.pagination.total,
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleFilterChange = (field: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = `&filters[search]=${filters.search}&filters[category]=${filters.category}&filters[company]=${filters.company}&filters[order]=${filters.order}&filters[price_lte]=${filters.price}`;
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
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchProducts();
  };

  const handleRedirect = (product: Product) => {
    if (product.id) {
      navigate(`/details/${product.id}`);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="p-6 bg-[#181920] min-h-screen text-white">
      <form
        onSubmit={handleSearch}
        className="max-w-[1100px] w-full mx-auto my-[50px] flex flex-col gap-[30px] p-[30px] bg-[#272935] rounded-lg"
      >
        <div className="flex justify-between gap-[20px]">
          <label className="flex flex-col w-[23%] gap-[7px] text-[#f8f8f8] text-[16px]" htmlFor="product">
            Search Product
            <input
              id="product"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="bg-[#272935] border border-[#767575] text-[#f8f8f8] rounded-lg py-[5px] px-3 focus:outline-none focus:ring-2 focus:ring-[#f06292]"
              type="text"
            />
          </label>

          <label className="flex flex-col w-[23%] gap-[7px] text-[#f8f8f8] text-[16px]">
            Select Category
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="bg-[#272935] border border-[#767575] text-[#f8f8f8] rounded-lg py-[5px] px-3 focus:outline-none focus:ring-2 focus:ring-[#f06292]"
            >
              <option value="all">All</option>
              {filterMeta.categories?.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col w-[23%] gap-[7px] text-[#f8f8f8] text-[16px]">
            Select Company
            <select
              value={filters.company}
              onChange={(e) => handleFilterChange("company", e.target.value)}
              className="bg-[#272935] border border-[#767575] text-[#f8f8f8] rounded-lg py-[5px] px-3 focus:outline-none focus:ring-2 focus:ring-[#f06292]"
            >
              <option value="all">All</option>
              {filterMeta.companies?.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col w-[23%] gap-[7px] text-[#f8f8f8] text-[16px]">
            Sort By
            <select
              value={filters.order}
              onChange={(e) => handleFilterChange("order", e.target.value)}
              className="bg-[#272935] border border-[#767575] text-[#f8f8f8] rounded-lg py-[5px] px-3 focus:outline-none focus:ring-2 focus:ring-[#f06292]"
            >
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
              <option value="high">High Price</option>
              <option value="low">Low Price</option>
            </select>
          </label>
        </div>

        <div className="flex justify-between items-center gap-[20px]">
          <div className="flex flex-col gap-3 max-w-[240px] w-full text-[#f8f8f8] font-medium">
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
            className="max-w-[230px] w-full px-6 py-[6px] bg-[#f06292] text-[#1b1c21] font-semibold rounded-lg hover:opacity-80 transition"
          >
            SEARCH
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="max-w-[230px] w-full px-6 py-[6px] bg-[#ffa726] text-[#1b1c21] font-semibold rounded-lg hover:opacity-80 transition"
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
            <p className="text-2xl text-center text-[#f8f8f8]">No products found.</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleRedirect(product)}
                className="text-[#F8F8F2] shadow-xl hover:shadow-2xl transition cursor-pointer p-4 rounded-2xl"
              >
                <img
                  src={product.attributes.image}
                  alt={product.attributes.title}
                  className="rounded-xl h-64 w-full object-cover"
                />
                <div className="text-center mt-4">
                  <h3 className="capitalize font-medium text-gray-400 text-lg">
                    {product.attributes.title}
                  </h3>
                  <p className="text-[#846eaa]">${product.attributes.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
          className="px-4 py-2 bg-[#272935] rounded-lg mx-2 hover:opacity-80 transition"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-[#181920] rounded-lg">
          Page {pagination.page} of {pagination.pageCount}
        </span>
        <button
          disabled={pagination.page === pagination.pageCount}
          onClick={() => handlePageChange(pagination.page + 1)}
          className="px-4 py-2 bg-[#272935] rounded-lg mx-2 hover:opacity-80 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Product;
