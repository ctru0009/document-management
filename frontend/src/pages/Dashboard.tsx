import React, { useEffect, useState } from "react";
import moment from "moment";
import NavigationBar from "../components/NavigationBar";
import PopUpPanel from "../components/PopUpPanel";
import { Data } from "../components/Schemas";
import { Helmet } from "react-helmet";
import api from "../api";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [assessments, setAssessments] = useState<Data[]>([]);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [assessment, setAssessment] = useState<Data | null>(null);

  const displayTable = (assessment: Data) => {
    return (
      <PopUpPanel
        isOpen={isOpen}
        items={assessment.submissions}
        assessment_id={assessment.id}
        setOpen={setIsOpen}
      />
    );
  };

  const backendUrl = import.meta.env.VITE_BACKEND_API_URL;
  useEffect(() => {
    // Fetch assessment from the API
    const fetchData = async () => {
      try {
        const response = await api.get(`${backendUrl}/assessment`);
        const jsonData = await response.data;
        setAssessments(jsonData);
        console.log(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const sortedAssessments = React.useMemo(() => {
    const sortableItems = [...assessments];
    if (sortConfig !== null) {
      if (sortConfig.key === "rubric") {
        sortableItems.sort((a, b) => {
          if (sortConfig.key !== null && a.rubric.name < b.rubric.name) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (sortConfig.key !== null && a.rubric.name > b.rubric.name) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        });
      }
      else if (sortConfig.key === "no_submission") {
        sortableItems.sort((a, b) => {
          if (sortConfig.key !== null && a.submissions.length < b.submissions.length) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (sortConfig.key !== null && a.submissions.length > b.submissions.length) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        });
      } 
      else {
        sortableItems.sort((a, b) => {
          if (
            sortConfig.key !== null &&
            a[sortConfig.key] < b[sortConfig.key]
          ) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (
            sortConfig.key !== null &&
            a[sortConfig.key] > b[sortConfig.key]
          ) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        });
      }
    }
    return sortableItems;
  }, [assessments, sortConfig]);

  const SortIcon = ({ columnName }: { columnName: string }) => {
    if (sortConfig.key !== columnName) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  const requestSort = (key: any) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleClick = (assessment: Data) => {
    if (isOpen) {
      setIsOpen(false);
      setAssessment(null);
    } else {
      setIsOpen(true);
      setAssessment(assessment);
      console.log(assessment);
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="bg-gradient-to-r from-cyan-300 to-blue-200 min-h-screen">
        <NavigationBar />
        <div className="p-6">
          <h1 className="text-xl font-semibold mb-4 text-black">Dashboard</h1>
          <div className="bg-white shadow-md rounded-lg p-4">
            <table className="min-w-full leading-normal border-collapse border border-gray-300 table-fixed">
              <thead>
                <tr>
                  <th
                    className="border-b border-gray-300 cursor-pointer p-2 text-left border"
                    onClick={() => requestSort("id")}
                  >
                    Assessment ID <SortIcon columnName="id" />
                  </th>
                  <th
                    className="border-b border-gray-300 cursor-pointer p-2 text-left border"
                    onClick={() => requestSort("name")}
                  >
                    Assessment Name <SortIcon columnName="name" />
                  </th>
                  <th
                    className="border-b border-gray-300 cursor-pointer p-2 text-left border"
                    onClick={() => requestSort("rubric")}
                  >
                    Rubric File Name <SortIcon columnName="rubric" />
                  </th>
                  <th
                    className="border-b border-gray-300 cursor-pointer p-2 text-left border"
                    onClick={() => requestSort("ctime")}
                  >
                    Created on <SortIcon columnName="ctime" />
                  </th>
                  <th
                    className="border-b border-gray-300 cursor-pointer p-2 text-left"
                    onClick={() => requestSort("no_submission")}
                  >
                    No. Submission <SortIcon columnName="no_submission" />
                  </th>
                  <th className="border-b border-gray-300 p-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedAssessments.map((assessment) => (
                  <tr key={assessment.id} className="hover:bg-gray-100">
                    <td className="border-b border-gray-300 p-2 border">
                      {assessment.id}
                    </td>
                    <td className="border-b border-gray-300 p-2 border">
                      {assessment.name}
                    </td>
                    <td className="border-b border-gray-300 p-2 border">
                      {assessment.rubric.name}
                    </td>
                    <td className="border-b border-gray-300 p-2 border">
                      {moment(assessment.ctime).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </td>
                    <td className="border-b border-gray-300 p-2 ">
                      {assessment.submissions.length}
                    </td>
                    <td className="border-b border-gray-300 p-2 text-center ">
                      <button
                        onClick={() => handleClick(assessment)}
                        className="mt-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-left"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isOpen && assessment && displayTable(assessment)}
    </>
  );
};

export default Dashboard;
