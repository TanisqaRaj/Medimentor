import React, { useState } from 'react'

const TotalUserList = () => {

// const [userList , setUserList] = useState([]);

 //Api call
//  const fetchUserlist = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/registration/users`
//       );
//       const success = response?.data?.success;
//       console.log("response data is",response.data);
//       if (success) {
//         console.log(response.data);
//         setUserList(List);
//       } else {
//         alert("Something went wrong");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUserlist();
//   }, []);


const [userList, setUserList] = useState([
  {
    name: "Dr. Priya Sharma",
    address: "123 Main St, Springfield",
    phone: 9876543210,
    email: "priya.sharma@example.com",
    username: "drpriyasharma",
    gender: "female",
  },
  {
    name: "Dr. Priya Sharma",
    address: "123 Main St, Springfield",
    phone: 9876543210,
    email: "priya.sharma@example.com",
    username: "drpriyasharma",
    gender: "female",
  },
  {
    name: "Dr. Priya Sharma",
    address: "123 Main St, Springfield",
    phone: 9876543210,
    email: "priya.sharma@example.com",
    username: "drpriyasharma",
    gender: "female",
  },
]) 

const handleDiscard = (index) => {
  const updatedList = userList.filter((_, i) => i !== index);
  setUserList(updatedList);
};


  return (
    <div className="w-full flex-grow max-w-[1280px] mx-auto px-6 py-8 font-manrope">
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">User Directory</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Manage platform users and account status.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/50">
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">User</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">Contact & Email</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">Address</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {userList.map((item, index) => (
                <tr key={index} className="hover:bg-surface-container-lowest/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-label-md text-on-surface">{item.name}</div>
                    <div className="font-caption text-outline text-xs">@{item.username} • {item.gender}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-label-md text-on-surface">{item.phone}</div>
                    <div className="font-caption text-outline text-xs">{item.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-body-md text-sm text-on-surface max-w-[250px] truncate">{item.address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Verified
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

export default TotalUserList
