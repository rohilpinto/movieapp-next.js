import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/Card";
import DiscoverCard from "../../components/Card/Discover";
import { Button, Grid } from "@mui/material";
import { useRouter } from "next/router";
import useGetPopularMovies from "../../Hooks/useGetPopularMovies";

const Discover = (props) => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [movies] = useGetPopularMovies(page);
  const [discoverResults, setDiscoverResults] = useState([]);

  useEffect(() => {
    // Always do navigations after the first render
    let isMounted = true;
    router.push(`/discover?page=${page}`);

    if (isMounted) {
      setDiscoverResults(movies?.data.results);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, movies]);

  return (
    <Grid container columnGap={2} justifyContent="space-between" alignItems="center">
      <Card
        items={discoverResults}
        render={(discoverResults) => (
          <Grid item xs={12} md={5} lg={2}>
            <DiscoverCard results={discoverResults} />
          </Grid>
        )}
      />
    </Grid>
  );
};

export default Discover;

export const getServerSideProps = async (context) => {
  const { page } = context.query;
  const movieData = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_MOVIE_DB_KEY}&language=en-US&page=${page}`);

  return {
    props: { movieData: movieData.data.results },
  };
};
