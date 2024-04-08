import { useEffect, useState } from "react";

function useFetchApi(url) {
  const [products, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setIsError(false);

        const response = await fetch(url);
        const json = await response.json();

        setProduct(json.data);
      } catch (error) {
        console.log(error);
        setIsError(true);
        throw new Error("Unable to fetch data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [url]);

  return {
    products,
    isLoading,
    isError,
  };
}

export default useFetchApi;
