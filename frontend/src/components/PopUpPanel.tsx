import { Submission } from "../components/Schemas";
import moment from "moment";
import { useNavigate } from "react-router-dom";
const PopUpPanel = ({
  isOpen,
  setOpen,
  items,
  assessment_id,
}: {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  items: Submission[];
  assessment_id: number;
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900 opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-md rounded p-4 w-5/6">
        <table className="min-w-full leading-normal border-collapse border border-gray-100 table-auto">
          <thead className="text-center">
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Submission ID</th>
              <th className="border px-4 py-2">Submitted On</th>
              <th className="border px-4 py-2">Total Marks</th>
              <th className="border px-4 py-2">Attachments</th>
              <th className="border px-4 py-2">Authors</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.id.toString()}
                className={index % 2 === 0 ? "bg-gray-100" : ""}
              >
                <td className="border px-4 py-2 text-center">{item.id}</td>
                <td className="border px-4 py-2 text-center">
                  {moment(item.ctime).format("MMMM Do YYYY, h:mm:ss a")}
                </td>
                <td className="border px-4 py-2 text-center">{item.totalMarks}</td>
                <td className="border px-4 py-2 wrap text-wrap text-center">
                  {item.attachments
                    .map((attachment) => attachment.name)
                    .join("")}
                </td>
                <td className="border px-4 py-2 text-center">
                  {item.authors.map((author) => author.name).join(",")}
                </td>
                <td className="border wrap text-wrap text-center">
                  {item.feedback ? "Graded" : "Not Graded"}
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() =>
                      navigate(
                        `/document-processing/${assessment_id}/${item.id}`
                      )
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center pt-3">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={setOpen.bind(null, false)}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default PopUpPanel;
