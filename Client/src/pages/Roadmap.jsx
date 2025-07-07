import Nav from "../components/Nav";
import { BiUpvote } from "react-icons/bi";
import { use, useDebugValue, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Roadmap = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
 console.log(user);

  //state for roadmap data and laoding
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upvoteLoading, setUpvoteLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [deleteCommentId, setDeleteCommentId] = useState(null);

  //fetch roadmap data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://roadmap-hub-backend.vercel.app/api/roadmap/${id}`
        );
        if (response.data.success) {
          setRoadmap({
            ...response.data.roadmap,
            upvote_count: Number(response.data.roadmap.upvote_count),
          });
          console.log(response.data);
          console.log(response.data.roadmap.comment_count);
        } else {
          setError("failed to load roadmap data");
        }

        const commentResponse = await axios.get(
          `https://roadmap-hub-backend.vercel.app/api/comments/${id}`
        );
        if (commentResponse.data.success) {
          setComments(commentResponse.data.comments || []);
        } else {
          setError("failed to load comments");
        }
        console.log(comments);
      } catch (error) {
        console.error("error fetching data:", error);
        setError("Something went wrong, please try again");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  //handle upvote

  const handleUpvote = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      setUpvoteLoading(true);
      const response = await axios.post(
        `https://roadmap-hub-backend.vercel.app/api/roadmap/${id}/upvote`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      if (response.data.success) {
        const updatedResponse = await axios.get(
          `https://roadmap-hub-backend.vercel.app/api/roadmap/${id}`
        );

        // Refetch roadmap to get updated upvote_count
        if (updatedResponse.data.success) {
          setRoadmap({
            ...updatedResponse.data.roadmap,
            upvote_count: Number(updatedResponse.data.roadmap.upvote_count),
            hasUpvoted: response.data.upvoted,
          });
        }
        console.log("Upvote response:", response.data);
        console.log("Updated roadmap:", updatedResponse.data);
      } else {
        setError("failed to upvote, try again");
      }
    } catch (error) {
      console.error("error upvoting:", error);
      setError("upvote failed,please try again");
    } finally {
      setUpvoteLoading(false);
    }
  };

  //post comment
  const handleCommentSubmit = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!commentText.trim()) {
      setError("comment can be empty");
      return;
    }
    if (commentText.length > 300) {
      setError("comment must be 300 characters or less");
      return;
    }
    try {
      setCommentLoading(true);
      setError(null);
      const response = await axios.post(
        `https://roadmap-hub-backend.vercel.app/api/comments/${id}`,
        { text: commentText, parent_comment_id: null },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (response.data.success) {
        const commentResponse = await axios.get(
          `https://roadmap-hub-backend.vercel.app/api/comments/${id}`
        );
        if (commentResponse.data.success) {
          setComments(commentResponse.data.comments || []);
        }
        const roadmapResponse = await axios.get(
          `https://roadmap-hub-backend.vercel.app/api/roadmap/${id}`
        );
        if (roadmapResponse.data.success) {
          setRoadmap({
            ...roadmapResponse.data.roadmap,
            upvote_count: Number(roadmapResponse.data.roadmap.upvote_count),
            hasUpvoted: roadmapResponse.data.roadmap.hasUpvoted || false,
          });
        }
        setCommentText("");
      } else {
        setError("Failed to post comment. Try again.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to post comment. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  //handle reply comment submission
  const handleReplyComment = async (parentId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!replyText.trim()) {
      setError("Reply cannot be empty");
      return;
    }
    if (replyText.length > 300) {
      setError("reply must be within 300 characters");
    }
    try {
      setCommentLoading(true);
      setError(null);
      const response = await axios.post(
        `https://roadmap-hub-backend.vercel.app/api/comments/${id}`,
        { text: replyText, parent_comment_id: parentId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      console.log("Reply POST response:", response.data);

      if (response.data.success) {
        const commentsResponse = await axios.get(
          `https://roadmap-hub-backend.vercel.app/api/comments/${id}`
        );
        console.log("Fetched comments:", commentsResponse.data.comments);
        if (commentsResponse.data.success) {
          setComments(commentsResponse.data.comments || []);
        }
        const roadmapResponse = await axios.get(
          `https://roadmap-hub-backend.vercel.app/api/roadmap/${id}`
        );
        if (roadmapResponse.data.success) {
          setRoadmap({
            ...roadmapResponse.data.roadmap,
            upvote_count: Number(roadmapResponse.data.roadmap.upvote_count),
            hasUpvoted: roadmapResponse.data.roadmap.hasUpvoted || false,
          });
        }
        setReplyText("");
        setReplyCommentId(null);
      } else {
        setError("Failed to post reply. Try again.");
      }
    } catch (error) {
      console.error(
        "Error posting reply:",
        error ? error.response?.data || error.message : "Unknown error"
      );
      setError("Failed to post reply. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  //deleting comments
  const handleDeleteComment = async (commentId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      setDeleteCommentId(commentId);
      setError(null);
      console.log("Deleting comment:", commentId);
      const response = await axios.delete(
        `https://roadmap-hub-backend.vercel.app/api/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      console.log("Delete response:", response.data);
      if (response.data.success) {
        const commentsResponse = await axios.get(
          `https://roadmap-hub-backend.vercel.app/api/comments/${id}`
        );
        if (commentsResponse.data.success) {
          setComments(commentsResponse.data.comments || []);
        }
        const roadmapResponse = await axios.get(
          `https://roadmap-hub-backend.vercel.app/api/roadmap/${id}`
        );
        if (roadmapResponse.data.success) {
          setRoadmap({
            ...roadmapResponse.data.roadmap,
            upvote_count: Number(roadmapResponse.data.roadmap.upvote_count),
            hasUpvoted: roadmapResponse.data.roadmap.hasUpvoted || false,
          });
        }
      } else {
        setError("Failed to delete comment. Try again.");
      }
    } catch (error) {
      console.error(
        "Error deleting comment:",
        error ? error.response?.data || error.message : "Unknown error"
      );
      setError("Failed to delete comment. Please try again.");
    } finally {
      setDeleteCommentId(null);
    }
  };

  //render comments recursively
  const renderComments = (commentList, depth = 0) => {
    if (!commentList || commentList.length === 0) {
      return <p className="text-gray-500 text-center">No comments yet</p>;
    }
    return commentList.map((comment) => {
      console.log("Comment:", comment);
      console.log("User ID:", user?.id, "Comment User ID:", comment.users_id);
      console.log("Can delete?", user?.id === comment.users_id);
      return (
        <div
          key={comment.id}
          className={`mt-3 ml-${
            depth * 4
          } p-2 bg-amber-50 shadow-sm text-black border border-amber-100 outline-none rounded-lg`}
        >
          <p className="text-xs text-gray-500">{comment.user_email}</p>
          <p className="break-words">{comment.text}</p>
          {user && (
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => {
                  setReplyCommentId(comment.id);
                  setReplyText("");
                }}
                className="text-xs text-amber-700 hover:underline cursor-pointer"
              >
                Reply
              </button>
              {user.user.id === comment.users_id && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  disabled={deleteCommentId === comment.id}
                  className="text-xs text-amber-700 hover:underline cursor-pointer"
                >
                  {deleteCommentId === comment.id ? "Deleting" : "Delete"}
                </button>
              )}
            </div>
          )}
          {replyCommentId === comment.id && (
            <div className="mt-2 flex flex-col  gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="write a reply comment"
                className="bg-slate-200 text-black border border-amber-200 p-2 h-14 "
                disabled={commentLoading}
              />
              <button
                onClick={() => handleReplyComment(comment.id)}
                disabled={commentLoading}
                className=" px-2 py-1 bg-amber-600 text-white rounded hover:bg-amber-700"
              >
                {commentLoading ? "Posting..." : "Post Reply"}
              </button>
            </div>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 ">
              {renderComments(comment.replies, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Show loading or error states
  if (loading)
    return <p className="text-center mt-10">Loading roadmap details</p>;
  if (error) return <p className="text-center mt-10"> {error}</p>;
  if (!roadmap) return null;

  return (
    <>
      <Nav />
      <section className="mb-10">
        <div className="flex items-center justify-center">
          <div className="px-6 py-4 mt-9 w-xl h-fit bg-[#ECEDB0] border border-yellow-50 outline-none rounded-xl">
            <div>
              <h1 className="text-4xl font-bold font-serif mt-3">
                {roadmap.title}
              </h1>
              <p className="mt-2">{roadmap.description}</p>
              <div className="mt-6 mb-2 flex flex-row items-center gap-1">
                <button
                  onClick={handleUpvote}
                  disabled={upvoteLoading}
                  className={`hover:text-red-600 ${
                    roadmap.hasUpvoted ? "text-red-500" : ""
                  }}`}
                >
                  <BiUpvote size={25} />
                </button>
                <span>{roadmap.upvote_count}</span>
              </div>
            </div>
            <hr className="mx-1 mt-1 text-slate-950" />

            {/* comments */}
            <div className="mt-2">
              <p>Comments {roadmap.comment_count}</p>
              <textarea
                placeholder="Write a comment"
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                }}
                disabled={commentLoading}
                className="bg-white text-black outline-none border border-white p-2 h-14 w-full mt-4 rounded-sm"
              />
              <button
                onClick={handleCommentSubmit}
                disabled={commentLoading}
                className="mt-2 px-4 py-2 bg-[#2A1458] text-white rounded hover:bg-[#3c2670]"
              >
                Comment
              </button>
              <div className="mt-6">Comments</div>
              <div className="">{renderComments(comments)}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Roadmap;
