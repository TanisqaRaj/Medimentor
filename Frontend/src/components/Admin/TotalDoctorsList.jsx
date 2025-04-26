import React, { useState } from "react";

const TotalDoctorsList = () => {

  //Api call
  // const [DocList, setDocList] = useState([]);

  // const fetchDoclist = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8080/registration/users`
  //     );
  //     const success = response?.data?.success;
  //     console.log("response data is", response.data);
  //     if (success) {
  //       console.log(response.data);
  //       setDocList(List);
  //     } else {
  //       alert("Something went wrong");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchDoclist();
  // }, []);

  const [doctorlist, setDoctorlist] =useState([
    {
      name: "Dr. Priya Sharma",
      phone: 9876543210,
      email: "priya.sharma@example.com",
      username: "drpriyasharma",
      certificate: "https://example.com/uploads/certificate.pdf",
      bio: "Experienced general physician with over 10 years of practice.",
      image: "https://example.com/uploads/profile-image.jpg",
      gender: "female",
      profession: ["General Physician", "Diabetologist"],
      experience: 10,
      department: "General Medicine",
      mciNumber: "MCI-123456",
    },
    {
      name: "Dr. Priya Sharma",
      phone: 9876543210,
      email: "priya.sharma@example.com",
      username: "drpriyasharma",
      certificate: "https://example.com/uploads/certificate.pdf",
      bio: "Experienced general physician with over 10 years of practice.",
      image: "https://example.com/uploads/profile-image.jpg",
      gender: "female",
      profession: ["General Physician", "Diabetologist"],
      experience: 10,
      department: "General Medicine",
      mciNumber: "MCI-123456",
    },
    {
      name: "Dr. Priya Sharma",
      phone: 9876543210,
      email: "priya.sharma@example.com",
      username: "drpriyasharma",
      certificate: "https://example.com/uploads/certificate.pdf",
      bio: "Experienced general physician with over 10 years of practice.",
      image: "https://example.com/uploads/profile-image.jpg",
      gender: "female",
      profession: ["General Physician", "Diabetologist"],
      experience: 10,
      department: "General Medicine",
      mciNumber: "MCI-123456",
    },
  ]) 
   
  const handleDiscard = (index) => {
    const updatedList = doctorlist.filter((_, i) => i !== index);
    setDoctorlist(updatedList);
  };

  return (
    <div className="w-full overflow-scroll">
      <div className="pb-5 ">
        <p className="px-4 pt-10 lg:px-10 pb-6 text-2xl font-bold text-gray-700">
          Doctor List
        </p>
        <div className="overflow-x-auto px-4 lg:px-10 ">
          <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
            {/* table column name */}
            <thead className="bg-emerald-200 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Contact</th>
                <th className="px-4 py-3 border">Gender</th>
                <th className="px-4 py-3 border">Username</th>
                <th className="px-4 py-3 border" style={{ width: "90px" }}>Email</th>
                <th className="px-4 py-3 border">Experience</th>
                <th className="px-4 py-3 border">Bio</th>
                <th className="px-4 py-3 border">Department</th>
                <th className="px-4 py-3 border" style={{ width: "90px" }}>Profession</th>
                <th className="px-4 py-3 border">Status</th>
              </tr>
            </thead>

            {/* table body */}
            <tbody className="shadow-2xl">
              {doctorlist.map((item, index) => (
                <tr
                  key={index}
                  className="text-gray-800 text-center border hover:bg-gray-100"
                >
                  <td className="px-4 py-3 border">{item.name}</td>
                  <td className="px-4 py-3 border">{item.phone}</td>
                  <td className="px-4 py-3 border">{item.gender}</td>
                  <td className="px-4 py-3 border">{item.username}</td>
                  <td className="px-4 py-3 border" style={{ width: "90px" }}>{item.email}</td>
                  <td className="px-4 py-3 border">{item.experience}</td>
                  <td className="px-4 py-3 border">{item.bio}</td>
                  <td className="px-4 py-3 border">{item.department}</td>
                  <td className="px-4 py-3 border" style={{ width: "90px" }}> {item.profession.map((profession, index) => (
                        <p key={index} className="border bg-emerald-200 rounded-lg p-1">
                          {profession}
                        </p>
                      ))}</td>
                  <td className="px-4 py-3 border">
                    <button className="borde bg-emerald-600 rounded-2xl p-1 space-y-1 shadow-xl">
                      Approve
                    </button>
                    <button className="border bg-red-400 rounded-2xl p-1 space-y-1 px-2 shadow-xl"
                      onClick={()=> handleDiscard(index)}
                    >
                      Discard
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TotalDoctorsList;
