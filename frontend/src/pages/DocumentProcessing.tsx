import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import FileDisplay from "../components/FileDisplay";
import NavigationBar from "../components/NavigationBar";
import { useLocation , useNavigate} from "react-router-dom";
import "react-resizable/css/styles.css";
import api from "../api";
import {
  MarksCreate,
  ResultCreate,
  CriterionRead,
} from "../components/Schemas";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

const DocumentProcessing = () => {
  const apikey = import.meta.env.VITE_TINYMCE_API_KEY;
  const backendUrlApi = import.meta.env.VITE_BACKEND_API_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const assessmentId = location.pathname.split("/")[2];
  const submissionId = location.pathname.split("/")[3];
  const editorRef = useRef(null as any);
  const [minMarks, setMinMarks] = useState<number>(0);
  const [maxMarks, setMaxMarks] = useState<number>(0);
  const [results, setResults] = useState<ResultCreate[]>([]);
  const [doc, setDoc] = useState("");
  const [fileID, setFileID] = useState<any>(null);
  const [rubricID, setRubricID] = useState<any>(null);
  const [criterias, setCriterias] = useState<CriterionRead[]>([]);

  useEffect(() => {
    fetchFileID(false);
    fetchFileID(true);
    fetchResults();
  }, []);

  const fetchFileID = async (isRubric: boolean) => {
    try {
      if (isRubric) {
        const response = await api.get(`${backendUrlApi}/assessment/${assessmentId}`);
        const jsonAssessment = await response.data;
        setRubricID(jsonAssessment.rubric.id);
        setCriterias(jsonAssessment.criteria);
        setMinMarks(jsonAssessment.minMarks);
        setMaxMarks(jsonAssessment.maxMarks);
      } else {
        const response = await fetch(
          `${backendUrlApi}/submission/${submissionId}`
        );
        const jsonData = await response.json();
        setFileID(jsonData.attachments[0].id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await fetch(
        `${backendUrlApi}/submission/${submissionId}/mark`
      );
      const jsonResults = await response.json();
      setDoc(jsonResults.feedback);
      editorRef.current.setContent(jsonResults.feedback);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const marks: MarksCreate = {
        results: results,
        feedback: editorRef.current.getContent(),
      };
      console.log(marks);
      const response = await api.post(
        `${backendUrlApi}/submission/${submissionId}/mark`,
        marks
      );
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    toast.success("Feedback submitted successfully");
    navigate("/dashboard");
  };

  return (
    <>
      <Helmet>
        <title>Document Processing Page</title>
      </Helmet>
      <div className="bg-gradient-to-r from-cyan-300 to-blue-200 min-h-screen pt-10">
        <NavigationBar />
        <div className="p-6 text-black flex flex-col h-full">
          <div className="flex">
            <div className="flex-1 pl-2 w-full">
              <h2 className="text-lg font-semibold mb-2">Assessment material</h2>
              <FileDisplay
                fileUrl={`${backendUrlApi}/document/${fileID}/download`}
                side="left"
              />
            </div>
            <div className="flex-1 pr-2 w-full">
              <h2 className="text-lg font-semibold mb-2">Rubrics</h2>
              <FileDisplay
                fileUrl={`${backendUrlApi}/document/${rubricID}/download`}
                side="right"
              />
            </div>
          </div>
          <div className="mt-5">
            <h2 className="text-lg font-semibold mb-2">Feedback and Marking</h2>
            <Editor
              apiKey={apikey}
              onInit={(_, editor) => (editorRef.current = editor)}
              initialValue={doc? doc : "Leave your feedback here..."}
              init={{
                height: 150,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
            {criterias.map((criteria) => (
              <div key={criteria.id}>
                <h2 className="text-lg font-semibold mb-2">{criteria.name}</h2>
                <p>
                  {minMarks} - {maxMarks}
                </p>
                <input
                  type="number"
                  placeholder="Enter mark"
                  className="border border-gray-300 rounded p-2 w-1/4"
                  onChange={(e) => {
                    const result: ResultCreate = {
                      value: parseInt(e.target.value),
                      criterion: criteria.id,
                    };
                    setResults([result]);
                  }}
                  required
                />
              </div>
            ))}
            <div className="mt-2">
              <button
                onClick={handleSubmit}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentProcessing;
