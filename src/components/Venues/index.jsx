import { Link } from "react-router-dom";
import { API_VENUES } from "../../shared/apis";
import useApiCall from "../../hooks/useApiCall";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useEffect, useState } from "react";

function Venues() {
  const [venues, setVenue] = useState([]);
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const [meta, setMeta] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(40);

  const apiCall = useApiCall();

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    apiCall(`${API_VENUES}?sort=created&page=${currentPage}&limit=${itemsPerPage}`, "GET", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey.key,
    })
      .then((data) => {
        setVenue(data.data);
        setMeta(data.meta);
      })
      // .then((data) => setVenue(data.data))
      .catch((error) => console.error("Error fetching data:", error));
    // Samme Kode!!
  }, [currentPage]);

  const Pagination = ({ itemsPerPage, totalItems, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <nav>
        <ul className="flex flex-wrap gap-2">
          {pageNumbers.map((number) => (
            <li key={number}>
              <button onClick={() => paginate(number)} className="btnStyle">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  console.log("meta", meta);
  console.log("venues", venues);
  return (
    <div className="venueSection">
      {!venues ? (
        <div className="loading"></div>
      ) : (
        venues.map((venue) => (
          <Link key={venue.id} to={`/venue/${venue.id}`} className="bg-redish rounded-lg">
            <div className="imgBox">{venue.media[0] && <img src={venue.media[0].url} alt={venue.media[0].alt} />}</div>
            <div className="p-3">
              <div className="flex justify-between">
                <h2>{venue.name}</h2>
                <p>⭐{venue.rating}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <h3>{venue.location.country}</h3>
                  <p>{venue.location.city}</p>
                </div>
                <p className="self-end">{venue.price}</p>
              </div>
            </div>
          </Link>
        ))
      )}
      {!meta ? (
        <div className="loading"></div>
      ) : (
        <div>
          <Pagination itemsPerPage={itemsPerPage} totalItems={meta.totalCount} paginate={paginate} />
        </div>
      )}
    </div>
  );
}
export default Venues;

// import { Link } from "react-router-dom";
// import { API_VENUES } from "../../shared/apis";
// import useApiCall from "../../hooks/useApiCall";
// import usePostApiKey from "../../hooks/usePostApiKey";
// import useLocalStorage from "../../hooks/useLocalStorage";
// import { useEffect, useState } from "react";

// function Venues() {
//   const [venues, setVenue] = useState([]);
//   const { apiKey } = usePostApiKey();
//   const { accessToken } = useLocalStorage();
//   const apiCall = useApiCall();

//   useEffect(() => {
//     apiCall(API_VENUES + "?sort=created", "GET", {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//       "X-Noroff-API-Key": apiKey.key,
//     })
//       .then((data) => setVenue(data.data))
//       .catch((error) => console.error("Error fetching data:", error));
//     // Samme Kode!!
//   }, []);

//   console.log("venues", venues);
//   return (
//     <div className="venueSection">
//       {venues.map((venue) => (
//         <Link key={venue.id} to={`/venue/${venue.id}`} className="bg-redish rounded-lg">
//           <div className="imgBox">{venue.media[0] && <img src={venue.media[0].url} alt={venue.media[0].alt} />}</div>
//           <div className="p-3">
//             <div className="flex justify-between">
//               <h2>{venue.name}</h2>
//               <p>⭐{venue.rating}</p>
//             </div>
//             <div className="flex justify-between">
//               <div>
//                 <h3>{venue.location.country}</h3>
//                 <p>{venue.location.city}</p>
//               </div>
//               <p className="self-end">{venue.price}</p>
//             </div>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }
// export default Venues;
