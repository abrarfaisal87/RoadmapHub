import { useState } from "react";
import Filter from "../components/Filter";
import Nav from "../components/Nav";
import RoadmapItem from "../components/RoadmapItem";

const Home = () => {
  // filterstates
  const [selectedStatus,setSelectedStatus] = useState("")
  const [selectedCategory,setSelectedCategory] = useState("")
  return (
    <>
      <div className="min-h-screen bg-[#F4EBD3] text-[#1a1a1a] px-4  lg:px-10">
        {/* navigation bar */}
        <Nav />

        {/* hero section */}
        <section className="mt-12 p-6 flex gap-3 items-center justify-center flex-col text-center">
          <h1 className="text-6xl font-bold  text-[#090040]">
            Welcome to Roadmap <span className="text-[#8A0000]">Hub</span>{" "}
          </h1>
          <p className="mt-2 text-2xl">
            Explore, upvote, and comment on development roadmaps!
          </p>
        </section>


        {/* straight bar */}
        <section className=" my-6">
          <hr className="text-[#819A91]" />
        </section>

        {/* filter section */}
        <Filter
         selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}/>

        {/*roadmap section */
       <RoadmapItem selectedStatus={selectedStatus} selectedCategory={selectedCategory} />
        }
      </div>
    </>
  );
};

export default Home;
