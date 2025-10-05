import { useState, useEffect } from "react";

// We will fetch data


// Interface was defined hear for the return type
export interface IsomeThinkData {

}

export default function useStarWarsPeople():IsomeThinkData {

  const [people, setPeople] = useState([]);

  useEffect(() => {
    async function fetchStwarWarsPeople() {
      const res = await fetch(
        "https://swapi.dev/api/people"
      );
      const { results } = await res.json();
      setPeople(results);
    }

    fetchStwarWarsPeople();
  }, []);

  return people;
}