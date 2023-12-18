import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
const StitchedList = () => {
  const [stitched, setStitched] = useState([]);
  const fetchData = () => {
    axios.get("http://localhost:5000/api/stitched").then((res) => {
      setStitched(res.data);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      <h1>Stitched</h1>
      {stitched.map((s) => (
        <div>
          <p>{s.price}</p>
        </div>
      ))}
    </div>
  );
};

export default StitchedList;
