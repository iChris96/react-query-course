import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Species } from "./Species";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  // TODO: get data for InfiniteScroll via React Query
  const {
    data,
    fetchNextPage, // function to call the next page
    hasNextPage, // boolean to verify if we are in the last page or not
    isLoading,
    isFetching,
    isError,
    error,
  } = useInfiniteQuery(
    "sw-species", // query key
    ({ pageParam = initialUrl }) => fetchUrl(pageParam), // we set the pageParam here, after that react-query will handle the page url
    { getNextPageParam: (lastPage) => lastPage.next || undefined } // set the value who tell us if they are next page or not (lastPage is the last response)
  );

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div>we have an Error: {error.toString()}</div>;

  return (
    <>
      {isFetching && <div className="loading">Fetching...</div>}
      <InfiniteScroll
        data={data}
        loadMore={fetchNextPage}
        hasMore={hasNextPage}
      >
        {data.pages.map((pageData) =>
          pageData.results.map((it) => (
            <Species
              key={it.key}
              name={it.name}
              language={it.language}
              averageLifespan={it.average_lifespan}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}
