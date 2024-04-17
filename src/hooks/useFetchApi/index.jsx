import { useEffect, useState } from "react";

function useFetchApi(url) {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);
        setIsError(false);

        const response = await fetch(url);
        const json = await response.json();

        // console.log(json.data);
        // setVenues(json.data);

        if (isMounted) {
          setVenues(json.data);
        }
      } catch (error) {
        console.log(error);
        setIsError(true);
        throw new Error("Unable to fetch data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return {
    venues,
    isLoading,
    isError,
  };
}

export default useFetchApi;
