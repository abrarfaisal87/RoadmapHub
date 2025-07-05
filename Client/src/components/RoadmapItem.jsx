import { BiUpvote } from "react-icons/bi";
import { LiaComments } from "react-icons/lia";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RoadmapItem = ({ selectedStatus, selectedCategory }) => {
  const [roadmaps, setRoadmaps] = useState([]);
  const navigate = useNavigate();

  //   fetching roadmap items
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await axios.get("https://roadmap-hub-backend-np65742q1-abrar-faisals-projects.vercel.app/api/roadmap");
        if (res.data && res.data.length > 0) {
          setRoadmaps(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch roadmap items");
      }
    };
    fetchRoadmaps();
  }, []);

  //   applying filters in Home.jsx
  const filterRoadmapItems = roadmaps.filter((item) => {
    return (
      (selectedStatus ? item.status === selectedStatus : true) &&
      (selectedCategory ? item.category === selectedCategory : true)
    );
  });

  return (
    <section>
      <div className="wholeContainer grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3  px-4 2xl:px-80 lg:px-10 mb-20">
        {/* for single item */}
        {filterRoadmapItems.map((item) => (
          <div
            className="singleItem bg-yellow-50 w-full lg:max-w-96  border-0 p-4 rounded-lg 
            hover:shadow-2xl transition-all duration-300 ease-in-out"
          >
            {/* title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold" onClick={()=>navigate(`/roadmap/${item.id}`)}>{item.title}</h1>
            {/* mid part */}

            <div className="flex flex-row gap-2 items-center mt-4">
              <div className="border rounded-2xl px-2 py-1 text-[10px] bg-red-500 text-white ">
                    {item.status}
              </div>
              <div className="border rounded-2xl px-2 py-1 text-[10px] bg-emerald-500 text-white">
                    {item.category} 
              </div>
            </div>

            {/* a divider for comments, upvotes and view more option */}
            <hr className="mt-8" />


            {/* comments, upvotes and view more option */}
            <div className="flex flex-row justify-between items-center mt-3">
              <div className="flex flex-row gap-6">

                {/* this will be icons for comments and upvotes */}

                <div className="flex flex-row gap-1 items-center hover:text-red-800" 
                onClick={()=>{navigate(`/roadmap/${item.id}`)}}>
                  <BiUpvote size={25} />
                  <p>{item.upvotes}</p>
                </div>

                <div className="flex flex-row gap-1 items-center text-slate-700 hover:text-slate-950" 
                onClick={()=>{navigate(`/roadmap/${item.id}`)}}>
                  <LiaComments size={25} />
                  <p>{item.comment_count}</p>
                </div>
              </div>
              {/* view more button */}
              <div className=" text-lg cursor-pointer text-slate-700 hover:text-slate-950 hover:underline"  
              onClick={()=>{navigate(`/roadmap/${item.id}`)}}>More</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoadmapItem;
