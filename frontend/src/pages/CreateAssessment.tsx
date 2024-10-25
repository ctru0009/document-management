import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import { CriterionCreate } from "../components/Schemas";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

interface AssessmentPost {
  name: string;
  rubric: number;
  criteria: CriterionCreate[];
}

const CreateAssessment = () => {
  const [assessment, setAssessment] = useState<AssessmentPost>({
    name: "",
    rubric: 0,
    criteria: [],
  });
  const [no_criteria, setNoCriteria] = useState<number>(0);
  const [criteria, setCriteria] = useState<CriterionCreate[]>([]);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAssessment({ ...assessment, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    assessment.criteria = criteria;
    console.log(assessment);
    api
      .post("/api/v1.0/assessment", assessment)
      .then((response) => {
        toast.success("Assessment created successfully");
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    navigate("/dashboard");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      api
        .post("/api/v1.0/document", formData)
        .then((response) => {
          setAssessment({ ...assessment, rubric: response.data.id });
          toast.success("File uploaded successfully");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Assessment</title>
      </Helmet>
      <div className="bg-gradient-to-r from-cyan-300 to-blue-200 min-h-screen flex items-center">
        <NavigationBar />
        <div className="max-w-lg mx-auto border border-gray-300 p-6 rounded-md m-5 bg-white">
          <h1 className="text-2xl font-bold mb-4">Create Assessment</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">
                <span className="text-gray-700">Name:</span>
                <input
                  type="text"
                  name="name"
                  value={assessment.name}
                  onChange={handleChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
            </div>
            <div>
              <label className="block mb-1">
                <span className="text-gray-700">Rubric File:</span>
                <input
                  type="file"
                  name="rubric_file"
                  onChange={handleFileChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </label>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="no_criteria"
              >
                Number of Criterias
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="no_criteria"
                type="number"
                placeholder="Number of Criterias"
                value={no_criteria}
                onChange={(e) => {
                  if (e.target.value === "" || parseInt(e.target.value) < 0) return [];
                  setNoCriteria(parseInt(e.target.value));
                  setCriteria(
                    Array.from(Array(parseInt(e.target.value)).keys()).map(
                      () => ({
                        name: "",
                        min: 0,
                        max: 0,
                      })
                    )
                  );
                }}
                required
              />
            </div>
            {
              // Display criteria input fields
              Array.from(Array(no_criteria).keys()).map((index) => (
                <div key={index} className="mb-2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor={`criteria_${index}`}
                  >
                    Criteria name {index + 1}
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id={`criteria_${index}`}
                    type="text"
                    placeholder={`Criteria ${index + 1}`}
                    onChange={(e) => {
                      criteria[index] = {
                        ...criteria[index],
                        name: e.target.value,
                      };
                      setCriteria([...criteria]);
                    }}
                    required
                  />
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor={`min_marks_${index}`}
                  >
                    Min marks
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id={`min_marks_${index}`}
                    type="number"
                    placeholder="Min marks"
                    onChange={(e) => {
                      criteria[index] = {
                        ...criteria[index],
                        min: parseInt(e.target.value),
                      };
                      setCriteria([...criteria]);
                    }}
                    required
                  />
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor={`max_marks_${index}`}
                  >
                    Max marks
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id={`max_marks_${index}`}
                    type="number"
                    placeholder="Max marks"
                    onChange={(e) => {
                      criteria[index] = {
                        ...criteria[index],
                        max: parseInt(e.target.value),
                      };
                      setCriteria([...criteria]);
                    }}
                    required
                  />
                </div>
              ))
            }
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateAssessment;
