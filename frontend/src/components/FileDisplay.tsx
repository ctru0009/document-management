import { useState, useEffect } from "react";
import api from "../api";
interface Props {
  fileUrl: string;
  side: "left" | "right";
}

const FileDisplay = ({ fileUrl, side }: Props) => {
  const [fileType, setFileType] = useState<string>("");

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await api.get(fileUrl);
        setFileType(response.headers["content-type"]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFile();
  }, [fileUrl]);

  return (
    <div
      className={`bg-gray-200 p-1 w-full align-top outline-black outline-offset-2 outline-1 border rounded-lg border-gray-700  ${
        side === "left" ? "pr-1" : "pl-1"
      }`}
    >
      {(
        <div className="h-full overflow-auto resize rounded-lg">
          {fileType.includes("video") ? (
            <div className="w-full h-full" >
              <video controls src={fileUrl} className="w-full h-full"/>
            </div>
          ) : fileType.includes("image") ? (
            <img src={fileUrl} className="w-full h-full object-contain" alt="file" />
          ) : fileType.includes("audio") ? (
            <audio controls src={fileUrl} className="w-full h-full" />
          ) : fileType.includes("pdf") ? (
            <div className="w-full h-full">
              <iframe src={fileUrl} className="w-full h-full aspect-auto" />
            </div>
          ) : (
            <div>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <h1> None </h1>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileDisplay;
