import { GET_USER_GIGS_ROUTE, DELETE_GIG_ROUTE } from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ConfirmModal from "../../../components/ConfirmModal";

function Index() {
  const [gigs, setGigs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gigToDelete, setGigToDelete] = useState(null);

  useEffect(() => {
    const getUserGigs = async () => {
      try {
        const {
          data: { gigs: gigsData },
        } = await axios.get(GET_USER_GIGS_ROUTE, {
          withCredentials: true,
        });
        setGigs(gigsData);
      } catch (err) {
        console.log(err);
      }
    };
    getUserGigs();
  }, []);

  // const handleDelete = async (id) => {
  //   const confirmed = confirm("Are you sure you want to delete this gig?");
  //   if(!confirmed) return;

  //   try{
  //     await axios.delete(`${DELETE_GIG_ROUTE}/${id}`, {
  //       withCredentials: true,
  //     });
  //     setGigs((prev) => prev.filter((gigs)=> gigs.id !== id));
  //   } catch (err){
  //     console.log("Error deleting gig:", err);
  //   }
  // };
  const handleDelete = (id) => {
    setGigToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${DELETE_GIG_ROUTE}/${gigToDelete}`, {
        withCredentials: true,
      });
      setGigs((prev) => prev.filter((g) => g.id !== gigToDelete));
    } catch (err) {
      console.log("Error deleting gig:", err);
    } finally {
      setGigToDelete(null);
    }
  };

  return (
    <div className="min-h-[80vh] my-10 mt-28 px-32">
      <h3 className="m-5 text-2xl font-semibold">All your Gigs</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Delivery Time
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {gigs.map(({ title, category, price, deliveryTime, id }) => {
              return (
                <tr
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                  key={id}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {title}
                  </th>
                  <td className="px-6 py-4">{category}</td>
                  <td className="px-6 py-4">{price}</td>
                  <td className="px-6 py-4">{deliveryTime}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/seller/gigs/${id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(id)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                  <ConfirmModal
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    onConfirm={confirmDelete}
                    message="Do you really want to delete this gig? This action cannot be undone."
                  />
                </tr> 
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Index;
