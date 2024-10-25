import { useEffect, useState } from "react";
import api from "../api";
import NavigationBar from "../components/NavigationBar";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Submission {
  attachments: number[];
  authors: number[];
}
interface Author {
  id: number;
  name: string;
}

const CreateSubmission = () => {
  const [author, setAuthor] = useState<Author>({
    id: 0,
    name: "",
  });
  const [submission, setSubmission] = useState<Submission>({
    attachments: [],
    authors: [],
  });
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<any | null>(null);
  const [assessment_id, setAssessmentId] = useState<number>(0);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await api.get(`/api/v1.0/assessment`);
      const data = await response.data;
      setAssessment(data);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      toast.error("Error fetching assessment");
    }
  }

  const handleAuthorSubmit = () => {
    api
      .post("/api/v1.0/person", { name: author.name })
      .then((response) => {
        toast.success("Author created successfully");
        setAuthor(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      api
        .post("/api/v1.0/document", formData)
        .then((response) => {
          setSubmission({ ...submission, attachments: [response.data.id] });
          toast.success("File uploaded successfully");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor({ ...author, name: e.target.value });
  };
  const handleSubmissionSubmit = () => {
    submission.authors = [author.id];
    const url = `/api/v1.0/assessment/${assessment_id}/submission`;
    api
      .post(url, submission)
      .then((_) => {
        toast.success("Submission created successfully");
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value.split(" ")[1]);
    setAssessmentId(id);
    console.log(id);
  };
  return (
    <>
      <Helmet>
        <title>Create Submission</title>
      </Helmet>
      <NavigationBar />
      <div className="w-screen h-screen bg-cover bg-center bg-gradient-to-r from-cyan-300 to-blue-200 justify-center flex items-center ">
        <div className="flex justify-center m-5 ">
          {/* Left Form */}
          <div className="w-1/2 max-w-md mx-4 bg-gradient-to-r from-cyan-300 to-blue-200">
            <form className="max-w-lg mx-auto border border-gray-800 p-6 rounded-md px-8 pt-6 pb-8 mb-4 bg-white">
              <h2 className="text-xl mb-4">Create author</h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="author_name"
                >
                  Author Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="author_name"
                  type="text"
                  placeholder="Author Name"
                  onChange={handleAuthorChange}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
                  type="button"
                  onClick={handleAuthorSubmit} // Attach event handler
                >
                  Create Author
                </button>
              </div>
            </form>

            {/* Display author */}
            {author != null && (
              <div className="max-w-lg mx-auto border border-gray-700 p-6 rounded-md mt-4 bg-white">
                <h2 className="text-xl mb-4">Author</h2>
                <p>
                  <span className="font-bold">ID:</span> {author.id}
                </p>
                <p>
                  <span className="font-bold">Name:</span> {author.name}
                </p>
              </div>
            )}
          </div>

          {/* Right Form */}
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-10 mb-4 border border-gray-700">
            <h2 className="text-xl mb-4">Create submission</h2>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="assessment_id"
              >
                Assessment Select
              </label>

            </div>
            <select
              id="items"
              name="items"
              className="mt-1 block w-full border rounded-md shadow-sm text-center"
              onChange={handleChangeSelect}
            >
              <option value="" disabled selected>Select assessment</option>
              {assessment != null &&
                assessment.map((item: any, index: number) => (
                  <option key={index}>
                    ID: {item.id} - Name: {item.name}
                  </option>
                ))}
            </select>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="file"
              >
                File
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="file"
                type="file"
                placeholder="File"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
                type="button"
                onClick={handleSubmissionSubmit} // Attach event handler
              >
                Create Submission
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateSubmission;
