import { useState, useEffect } from "react";
import api from "../api";
import NavigationBar from "../components/NavigationBar";
import { toast } from "react-toastify";
import moment from "moment";
const Profile = () => {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);

  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    // Fetch user data based on the user name from the backend
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/v1.0/profile");
        const data = await response.data;
        setUser({
          name: data.name,
          email: data.email,
          avatar: "https://i.pravatar.cc/300",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error fetching user data");
      }
    };

    const fetchUserLogs = async () => {
      try {
        const response = await api.get("/api/v1.0/log");
        const data = await response.data;
        setLogs(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching user logs:", error);
        toast.error("Error fetching user logs");
      }
    };
    fetchUser();
    fetchUserLogs();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavigationBar />

      <div className="pt-20 h-screen bg-gradient-to-r from-cyan-300 to-blue-200">
        <div className="flex justify-center text-center">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-center mb-2">Profile</h2>
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-gray-200"
              />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
        <div className=" pt-20 bg-gradient-to-r from-cyan-300 to-blue-200">
          <table className="m-[-20] rounded-lg bg-white table-fixed min-w-full px-5 leading-normal border-solid border-gray-900">
            <caption className="caption-top">User Action Logs</caption>
            <thead>
              <tr className="border">
                <th>Log ID</th>
                <th>Time</th>
                <th>Action</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="text-center border">
              {logs.map((log, index) => (
                <tr key={index} className=" hover:bg-blue-200 border">
                  <td>{log.id}</td>
                  <td>{moment(log.timestamp).format("MMMM Do YYYY, h:mm:ss a")}</td>
                  <td>{log.action}</td>
                  <td>{log.description}</td>
                  <td className='$`}`'>{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Profile;
