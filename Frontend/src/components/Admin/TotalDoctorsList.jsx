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
    <div className="w-full flex-grow max-w-[1280px] mx-auto px-6 py-8 font-manrope">
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Doctor Directory</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Review and manage registered medical professionals.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/50">
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">Specialty & Dept</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">Experience</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {doctorlist.map((item, index) => (
                <tr key={index} className="hover:bg-surface-container-lowest/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-label-md text-on-surface">{item.name}</div>
                    <div className="font-caption text-outline text-xs">{item.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-label-md text-on-surface">{item.department}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.profession.map((prof, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-primary-container/10 text-primary-container text-[10px] font-bold uppercase">
                          {prof}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-body-md text-on-surface">{item.experience} Years</div>
                    <div className="font-caption text-outline text-xs truncate max-w-[200px]">{item.bio}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-sm px-4 py-2 rounded-xl transition-all shadow-sm">
                        Approve
                      </button>
                      <button 
                        onClick={() => handleDiscard(index)}
                        className="bg-surface-container hover:bg-red-50 text-on-surface-variant hover:text-red-600 border border-outline-variant/50 hover:border-red-200 font-label-md text-sm px-4 py-2 rounded-xl transition-all"
                      >
                        Discard
                      </button>
                    </div>
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
