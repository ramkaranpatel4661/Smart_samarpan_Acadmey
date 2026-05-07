import React, { useState } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import { FaSpinner } from 'react-icons/fa';

const categories = [
  "9th Class JEE Foundation",
  "10th Class JEE Foundation",
  "11th Class JEE Foundation",
  "12th Class JEE Foundation",
  "Target JEE Mains",
  "Target JEE Advanced",
  "Target Olympiad",
];

const AddCourse = ({ user }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (user && user.role !== "admin") {
    return (
      <Layout>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        </div>
      </Layout>
    );
  }

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const { fetchCourses } = CourseData();

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    myForm.append("file", image);

    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      setBtnLoading(false);
      await fetchCourses();
      // Redirect back to the courses list after successful submission
      navigate('/admin/course');
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  return (
    <Layout>
      <h2 className="adm-page-title">Add New Course</h2>
      
      <div className="adm-form-card">
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="adm-label">Course Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="adm-input"
                placeholder="Enter course title"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="adm-label">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="adm-input"
              >
                <option value={""}>Select Category</option>
                {categories.map((e) => (
                  <option value={e} key={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="adm-label">Course Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="adm-input"
              style={{ minHeight: '120px' }}
              placeholder="Provide a detailed description of the course..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className="adm-label">Price (₹)</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="adm-input"
                placeholder="0"
              />
            </div>
            
            <div>
              <label htmlFor="duration" className="adm-label">Duration (Weeks)</label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="adm-input"
                placeholder="e.g. 12"
              />
            </div>

            <div>
              <label htmlFor="createdBy" className="adm-label">Instructor Name</label>
              <input
                type="text"
                id="createdBy"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                required
                className="adm-input"
                placeholder="Instructor name"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="image" className="adm-label">Course Thumbnail</label>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                id="image" 
                required 
                onChange={changeImageHandler} 
                className="adm-input"
                style={{ padding: '10px' }}
              />
            </div>
          </div>

          {imagePrev && (
            <div className="mt-4">
              <p className="adm-label">Thumbnail Preview</p>
              <img src={imagePrev} alt="Course Preview" className="rounded-xl w-full h-48 object-cover border border-white/10" />
            </div>
          )}

          <button
            type="submit"
            disabled={btnLoading}
            className="adm-btn-primary"
          >
            {btnLoading ? <><FaSpinner className="animate-spin"/> Processing...</> : "Publish Course"}
          </button>
        </form>
      </div>
    </Layout>

  );
};

export default AddCourse;