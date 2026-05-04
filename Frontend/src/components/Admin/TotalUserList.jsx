import { useEffect, useState } from "react";
import api from "../../api";
import { useSelector } from "react-redux";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

// Backend doesn't have a list-all-users endpoint yet — using totaldoctors route pattern
// We'll add a /users/list route; for now fetch from auth verify or use existing data
const TotalUserList = () => {
  const [userList, setUserList] = useState([]);
  const token = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`${BACKEND}/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) setUserList(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleDiscard = (index) => setUserList((prev) => prev.filter((_, i) => i !== index));

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
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">Gender</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {userList.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant font-body-md">No users found</td></tr>
              ) : userList.map((item, index) => (
                <tr key={index} className="hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-label-md text-on-surface">{item.name}</div>
                    <div className="font-caption text-outline text-xs">@{item.username}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-label-md text-on-surface">{item.phone}</div>
                    <div className="font-caption text-outline text-xs">{item.email}</div>
                  </td>
                  <td className="px-6 py-4 font-body-md text-on-surface capitalize">{item.gender}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDiscard(index)} className="bg-surface-container hover:bg-red-50 text-on-surface-variant hover:text-red-600 border border-outline-variant/50 font-label-md text-sm px-4 py-2 rounded-xl transition-all">
                      Remove
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

export default TotalUserList;
