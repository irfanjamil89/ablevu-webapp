"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";

// User Interface
interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  user_role: "Contributor" | "Business" | "User";
  account_status: string;
  created_at: string;
}

// Component State Types
type UserRole = "Contributor" | "Business" | "User" | "";

type UpdateProfileAdminDto = {
  first_name?: string | null;
  last_name?: string | null;
  email?: string;
};

type ToastType = "success" | "error";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<UpdateProfileAdminDto>({
    first_name: null,
    last_name: null,
    email: "",
  });
  const [OpenCreateUserModal, setOpenCreateUserModal] = useState<boolean>(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "", // Changed from emailAddress to email
    password: "",
    userType: "",
    consent: false,
  });
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };


  // Handle user type selection
  const handleUserType = (type: string) => {
    setForm({ ...form, userType: type });
  };

  const [passwordFocus, setPasswordFocus] = useState(false);

  const [rules, setRules] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setForm({ ...form, password: value });

    // validation rules
    setRules({
      length: value.length >= 12,
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%]/.test(value),
    });
  };


  // Submit signup form
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserLoading(true);
    setUserError("");
    setSuccess("");

    // Ensure the correct payload format
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      emailAddress: form.emailAddress, // Matching field name
      password: form.password,
      userType: form.userType,
      consent: true,
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_BASE_URL + "users/signup",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );


      if (response.status === 201) {
        setSuccess("User Account has been created successfully! You’ll be redirected shortly.");
        setOpenCreateUserModal(false);
      } else {
        setError(response.data?.message || "Signup failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Server error. Please try again.");
    } finally {
      setUserLoading(false);
    }
  };


  useEffect(() => {
    if (selectedUser) {
      setEditForm({
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        email: selectedUser.email,
      });

      setPendingRole(selectedUser.user_role); // important
    }
  }, [selectedUser]);

  type PopupType = "success" | "error";

  const [popup, setPopup] = useState<{
    type: PopupType;
    title: string;
    message: string;
    open: boolean;
  } | null>(null);

  const openPopup = (type: PopupType, title: string, message: string) => {
    setPopup({ type, title, message, open: true });
  };

  const closePopup = () => setPopup(null);

  const [pendingRole, setPendingRole] = useState<
    "Contributor" | "Business" | "User" | null
  >(null);

  const [saving, setSaving] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFeatures = filteredUsers.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const authHeaders = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const updateProfileAdmin = async () => {
    if (!selectedUser) return;

    const res = await fetch(
      `${API_BASE}users/${selectedUser.id}/update-profile-admin`,
      {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(editForm),
      }
    );

    if (res.status === 401) {
      alert("Unauthorized – token missing or expired");
      return;
    }

    if (!res.ok) throw new Error("Update failed");

    const updatedUser: User = await res.json();

    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setFilteredUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setSelectedUser(updatedUser);
  };

  const changeRoleAdmin = async (
    newRole: "Contributor" | "Business" | "User"
  ) => {
    if (!selectedUser) return;

    const res = await fetch(
      `${API_BASE}users/${selectedUser.id}/change-role-admin`,
      {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ newRole }),
      }
    );

    if (res.status === 401) {
      alert("Unauthorized – token missing or expired");
      return;
    }

    if (!res.ok) throw new Error("Role change failed");

    const updatedUser = { ...selectedUser, user_role: newRole };

    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setFilteredUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setSelectedUser(updatedUser);
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole]);

  const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}users/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const data: User[] = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = (): void => {
    let filtered = [...users];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((user: User) => {
        const name = `${user.first_name || ""} ${user.last_name || ""
          }`.toLowerCase();
        const email = user.email.toLowerCase();
        const search = searchTerm.toLowerCase();
        return name.includes(search) || email.includes(search);
      });
    }

    // Filter by role
    if (selectedRole) {
      filtered = filtered.filter(
        (user: User) => user.user_role === selectedRole
      );
    }

    setFilteredUsers(filtered);
  };

  const clearFilters = (): void => {
    setSearchTerm("");
    setSelectedRole("");
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getFullName = (user: User): string => {
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return firstName || lastName
      ? `${firstName} ${lastName}`.trim()
      : "No Name";
  };

  const handleRoleSelect = (role: UserRole): void => {
    setSelectedRole(role);
  };

  const [confirmPopup, setConfirmPopup] = useState<{
  open: boolean;
  userId: string;
  status: "Active" | "Inactive" | "Suspended" | "Deleted";
  title: string;
  message: string;
} | null>(null);


const requestStatusChange = (
  userId: string,
  status: "Active" | "Inactive" | "Suspended" | "Deleted"
) => {
  const messages: Record<string, { title: string; message: string }> = {
    Active:    { title: "Activate User",    message: "Are you sure you want to mark this user as Active?" },
    Inactive:  { title: "Deactivate User",  message: "Are you sure you want to mark this user as Inactive?" },
    Suspended: { title: "Suspend User",     message: "Are you sure you want to suspend this user?" },
    Deleted:   { title: "Delete User",      message: "Are you sure you want to permanently delete this user? This action cannot be undone." },
  };

  setConfirmPopup({
    open: true,
    userId,
    status,
    ...messages[status],
  });
};



  const handleAccountStatusChange = async (
    userId: string,
    status: "Active" | "Inactive" | "Suspended" | "Deleted"
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}users/${userId}/account-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

       await fetchUsers();

      const result = await response.json();

      // Update UI locally
      setUsers((prevUsers: any[]) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status } : user
        )
      );

      // ✅ Show success popup
      openPopup(
        "success",
        "Status Updated",
        `User has been ${status === "Deleted" ? "deleted" : `marked as ${status}`} successfully.`
      );

    } catch (error) {
      console.error("Error updating status:", error);

      // ✅ Show error popup
      openPopup("error", "Update Failed", "Could not update account status. Please try again.");
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center w-full items-center h-[400px]">
        <img
          src="/assets/images/favicon.png"
          className="w-15 h-15 animate-spin"
          alt="Favicon"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="w-full ">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="w-full min-h-screen bg-white">
          {/* <!-- Header Row --> */}
          <div className="w-full min-h-screen bg-white px-6 py-5">
            {/* <!-- Header --> */}
            <div className="flex flex-wrap gap-y-4 items-center justify-between mb-8">
              {/* <!-- Title --> */}

              <h1 className="text-2xl font-semibold text-gray-900">
                All Users ({filteredUsers.length})
              </h1>

              {/* <!-- Controls --> */}

              <div className="flex flex-wrap gap-y-4 items-center gap-3">
                {/* clear all */}
                <div
                  className="text-md text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={clearFilters}
                >
                  <div className="text-md text-gray-500 cursor-pointer">
                    Clear All
                  </div>
                </div>

                {/* <!-- BUSINESS STATUS --> */}

                <div className="relative inline-block text-left">
                  {/* <!-- Hidden Toggle --> */}
                  <input
                    type="checkbox"
                    id="business-status-toggle"
                    className="hidden peer"
                  />

                  {/* <!-- Trigger --> */}
                  <label
                    htmlFor="business-status-toggle"
                    className="flex items-center justify-between border border-gray-300 text-gray-500 text-sm px-3 py-2.5 rounded-lg hover:border-[#0519CE] cursor-pointer w-auto md:w-[250px] transition-all duration-200"
                  >
                    {selectedRole || "User Role"}
                    <svg
                      className="w-2.5 h-2.5 ms-3 transition-transform duration-200 peer-checked:rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </label>

                  {/* <!-- Click outside overlay --> */}
                  <label
                    htmlFor="business-status-toggle"
                    className="hidden peer-checked:block fixed inset-0 z-10"
                  ></label>

                  {/* <!-- Dropdown --> */}
                  <div className="absolute z-20 mt-2 hidden peer-checked:block border border-gray-200 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-[250px]">
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <label htmlFor="business-status-toggle">
                          <a
                            onClick={() => handleRoleSelect("Contributor")}
                            className="block px-3 py-1 hover:bg-gray-100 cursor-pointer"
                          >
                            Contributor
                          </a>
                        </label>
                      </li>
                      <li>
                        <label htmlFor="business-status-toggle">
                          <a
                            onClick={() => handleRoleSelect("Business")}
                            className="block px-3 py-1 hover:bg-gray-100 cursor-pointer"
                          >
                            Business
                          </a>
                        </label>
                      </li>
                      <li>
                        <label htmlFor="business-status-toggle">
                          <a
                            onClick={() => handleRoleSelect("User")}
                            className="block px-3 py-1 hover:bg-gray-100 cursor-pointer"
                          >
                            User
                          </a>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* <!-- Search --> */}
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 w-auto lg:w-[280px] md:w-[250px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by Name, Email"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchTerm(e.target.value)
                    }
                    className="w-full border-none focus:outline-none focus:ring-0 font-medium text-sm text-gray-700 placeholder-gray-700 ml-2"
                  />
                </div>
                <button
                  onClick={() => setOpenCreateUserModal(true)}
                  className="px-4 py-3 text-sm font-bold bg-[#0519CE] text-white rounded-lg cursor-pointer hover:bg-blue-700 transition"
                >
                  Create User
                </button>
              </div>
            </div>

            {/* <!-- Empty State Content --> */}
            <section className="flex-1">
              <input
                type="radio"
                name="menuGroup"
                id="none"
                className="hidden"
                defaultChecked
              />

              <div className="h-auto overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-[#EFF0F1] text-gray-500 text-sm font-bold">
                    <tr>
                      <th
                        scope="col"
                        className="w-auto lg:w-[800px] py-3 pr-3 pl-3"
                      >
                        Name/Email
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Joining Date
                      </th>
                      <th scope="col" className="w-auto lg:w-[200px] px-6 py-3">
                        User Role
                      </th>
                      <th scope="col" className="w-auto lg:w-[200px] px-6 py-3">
                        Account Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Profiles Created
                      </th>
                      <th scope="col" className="px-3 py-3 text-right"></th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      currentFeatures.map((user: User, index: number) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-5 pr-4 pl-3 w-[60%]">
                            <span className="block font-semibold">
                              {getFullName(user)}
                            </span>
                            <span className="text-sm text-gray-600">
                              {user.email}
                            </span>
                          </td>
                          <td className="px-6 py-5 w-4/5">
                            {formatDate(user.created_at)}
                          </td>

                          <td className="px-6 py-5 w-4/5">
                          {user.user_role}
                          </td>
                          <td className="px-6 py-5 w-4/5">
                          {user.account_status}
                          </td>

                          {/* Dropdown Cell */}
                          <td className="relative px-6 py-5 text-right">
                            {/* Trigger */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation(); // window click se close na ho
                                setOpenMenuId(
                                  openMenuId === user.id ? null : user.id
                                );
                              }}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-600"
                              aria-haspopup="menu"
                              aria-expanded={openMenuId === user.id}
                            >
                              <span className="text-2xl leading-none">⋮</span>
                            </button>

                            {/* Dropdown */}
                            {openMenuId === user.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-6 top-[60px] w-[220px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
                                role="menu"
                              >
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    openEditModal(user);
                                  }}
                                >
                                  Edit
                                </button>

                                {/* SUSPEND */}
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                  onClick={() => { setOpenMenuId(null); requestStatusChange(user.id, "Suspended"); }}
                                >
                                  Suspend
                                </button>

                                {/* INACTIVE */}
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                  onClick={() => { setOpenMenuId(null); requestStatusChange(user.id, "Inactive"); }}
                                >
                                  Inactive
                                </button>

                                {/* ACTIVE */}
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                  onClick={() => { setOpenMenuId(null); requestStatusChange(user.id, "Active"); }}
                                >
                                  Active
                                </button>

                                {/* DELETE */}
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                  onClick={() => { setOpenMenuId(null); requestStatusChange(user.id, "Deleted"); }}
                                >
                                  Delete
                                </button>

                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {/* ===== PAGINATION CONTROLS ===== */}
                {!loading && filteredUsers.length > 0 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
                    {/* Left side: Entry counter */}
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, filteredUsers.length)} of{" "}
                      {filteredUsers.length} entries
                    </div>

                    {/* Right side: Pagination buttons */}
                    <div className="flex items-center gap-2">
                      {/* Previous Button */}
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${currentPage === 1
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                          }`}
                      >
                        Previous
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, idx) => (
                          <React.Fragment key={idx}>
                            {page === "..." ? (
                              <span className="px-3 py-1 text-gray-500">
                                ...
                              </span>
                            ) : (
                              <button
                                onClick={() => goToPage(page as number)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === page
                                  ? "bg-[#0519CE] text-white"
                                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                  }`}
                              >
                                {page}
                              </button>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${currentPage === totalPages
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                          }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* ===== EDIT USER MODAL ===== */}
              {isEditOpen && selectedUser && (
                <div
                  className="fixed inset-0 z-[999] flex items-center justify-center"
                  onClick={closeEditModal}
                >
                  <div className="absolute inset-0 bg-black/40"></div>

                  <div
                    className="relative w-[95%] max-w-[520px] bg-white rounded-2xl shadow-xl border border-gray-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Edit User
                        </h2>
                        <p className="text-sm text-gray-500">
                          {selectedUser.email}
                        </p>
                      </div>

                      <button
                        onClick={closeEditModal}
                        className="w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-500">
                            First Name
                          </label>
                          <input
                            value={editForm.first_name ?? ""}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                first_name: e.target.value,
                              }))
                            }
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            placeholder="First name"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-gray-500">
                            Last Name
                          </label>
                          <input
                            value={editForm.last_name ?? ""}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                last_name: e.target.value,
                              }))
                            }
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            placeholder="Last name"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs text-gray-500">Email</label>
                          <input
                            value={editForm.email ?? ""}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                email: e.target.value,
                              }))
                            }
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            placeholder="Email"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs text-gray-500">
                            User Role
                          </label>
                          <select
                            value={pendingRole ?? selectedUser.user_role}
                            onChange={(e) =>
                              setPendingRole(
                                e.target.value as
                                | "Contributor"
                                | "Business"
                                | "User"
                              )
                            }
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                          >
                            <option value="Contributor">Contributor</option>
                            <option value="Business">Business</option>
                            <option value="User">User</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs text-gray-500">
                            Joining Date
                          </label>
                          <div className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">
                            {formatDate(selectedUser.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
                      <button
                        onClick={closeEditModal}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={async () => {
                          try {
                            setSaving(true); // 🔄 show loader

                            // 1) Update profile
                            await updateProfileAdmin();

                            // 2) Update role only if changed
                            if (
                              pendingRole &&
                              selectedUser &&
                              pendingRole !== selectedUser.user_role
                            ) {
                              await changeRoleAdmin(pendingRole);
                            }

                            closeEditModal();

                            await fetchUsers();
                            setCurrentPage(1);
                            openPopup(
                              "success",
                              "User Updated",
                              "User updated successfully."
                            );
                          } catch (err: any) {
                            openPopup(
                              "error",
                              "Update Failed",
                              err?.message || "Something went wrong"
                            );
                          } finally {
                            setSaving(false); // ❌ hide loader
                          }
                        }}
                        disabled={saving}
                        className={`px-4 py-2 rounded-lg text-sm font-medium text-white
    ${saving
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#0519CE] hover:opacity-95"
                          }
  `}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
            {/* ===== SUCCESS / ERROR POPUP MODAL ===== */}
            {popup?.open && (
              <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8 relative">
                  <div className="flex justify-center mb-4">
                    <div
                      className={`rounded-full p-3 ${popup.type === "success" ? "bg-[#0519CE]" : "bg-red-600"
                        }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        {popup.type === "success" ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14"
                          />
                        )}
                      </svg>
                    </div>
                  </div>

                  <h2 className="text-lg font-bold mb-2">{popup.title}</h2>
                  <p className="mb-4">{popup.message}</p>

                  <button
                    className={`px-4 py-2 rounded-lg cursor-pointer text-white ${popup.type === "success" ? "bg-[#0519CE]" : "bg-red-600"
                      }`}
                    onClick={closePopup}
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
            {success && (

              <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8 relative">
                  {/* Check Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-[#0519CE] rounded-full p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Modal content */}
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Success</h2>
                  <p className="text-gray-600 text-sm mb-6">User account has been created</p>

                  {/* OK Button */}
                  <button
                    onClick={() => setSuccess("")}
                    className="bg-[#0519CE] hover:bg-[#0212a0] text-white font-medium rounded-full px-6 py-2 w-full transition-all cursor-pointer"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
            {OpenCreateUserModal && (
              <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-xs">
                <div className="relative bg-white rounded-2xl shadow-2xl w-[550px]  p-8">
                  {/* Close Button */}
                  <button
                    onClick={() => setOpenCreateUserModal(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold cursor-pointer"
                  >
                    ×
                  </button>
                  <div className="mb-6 text-center">
                    <img
                      src="https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=128,h=128,f=auto,dpr=1,fit=contain/f1734964303683x924828582539070500/Profile.png"
                      alt="User Icon"
                      className="mx-auto mb-2"
                    />
                    <h2 className="text-2xl font-semibold text-black">
                      Create User Account
                    </h2>

                  </div>

                  <form className="space-y-6" onSubmit={handleSignup}>
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="relative">
                        <input
                          type="text"
                          id="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          placeholder=" "
                          maxLength={50}
                          pattern="^[A-Za-z\s]{1,50}$"
                          className="peer block w-full rounded-lg border border-solid border-gray-500 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-[#0519CE] hover:border-[#0519CE]"
                        />
                        <label
                          htmlFor="firstName"
                          className=" absolute start-1 top-2 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75"
                        >
                          First Name
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          id="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          required
                          placeholder=" "
                          maxLength={50}
                          pattern="^[A-Za-z\s]{1,50}$"
                          className="peer block w-full rounded-lg border border-gray-500 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-[#0519CE] hover:border-[#0519CE]"
                        />
                        <label
                          htmlFor="lastName"
                          className="absolute start-1 top-2 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75"
                        >
                          Last Name
                        </label>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        id="userType"
                        value={form.userType}
                        onChange={(e) => setForm({ ...form, userType: e.target.value })}
                        required
                        className="block w-full rounded-lg border border-gray-500 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-[#0519CE] hover:border-[#0519CE] focus:outline-none appearance-none"
                      >
                        <option value="" disabled hidden></option>
                        <option value="User">User</option>
                        <option value="Contributor">Contributor</option>
                        <option value="Business">Business</option>
                      </select>
                      <label
                        htmlFor="userType"
                        className={`absolute start-1 bg-white px-2 text-sm duration-300 transform ${form.userType
                          ? "top-2 -translate-y-4 scale-75 text-gray-500"
                          : "top-4 scale-100 translate-y-0 text-gray-500"
                          }`}
                      >
                        User Type
                      </label>
                      {/* Chevron icon */}
                      <div className="pointer-events-none absolute right-3 top-4">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 10 6">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                        </svg>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <input
                        type="email"
                        id="emailAddress"
                        value={form.emailAddress}
                        onChange={handleChange}
                        required
                        placeholder=" "
                        className="peer block w-full rounded-lg border border-gray-500 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-[#0519CE] hover:border-[#0519CE]"
                      />
                      <label
                        htmlFor="email"
                        className="absolute start-1 top-2 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75"
                      >
                        Email Address
                      </label>
                    </div>



                    {/* Password */}
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={form.password}
                        onChange={handlePasswordChange}
                        required
                        placeholder=" "
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                        className="peer block w-full rounded-lg border border-gray-500 bg-transparent px-2.5 pt-4 pb-2.5 pr-10 text-sm text-gray-900 focus:border-[#0519CE] hover:border-[#0519CE]"
                      />
                      <label
                        htmlFor="password"
                        className="absolute start-1 top-2 text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:scale-75"
                      >
                        Password
                      </label>

                      {/* Toggle button */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {showPassword ? (
                          // Eye slash icon (password visible)
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          // Eye icon (password hidden)
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>

                      {/* Password validation rules */}
                      <div
                        style={{
                          maxHeight: passwordFocus ? "200px" : "0",
                          opacity: passwordFocus ? 1 : 0,
                        }}
                        className="mt-2 text-xs transition-all duration-500 overflow-hidden mb-2"
                      >
                        <p className="text-[14px] mt-2">Password must:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">

                          <li className={`${rules.length ? "text-green-600" : "text-red-600"}`}>
                            Be a minimum of 12 characters
                          </li>

                          <li className={`${rules.lowercase ? "text-green-600" : "text-red-600"}`}>
                            Include at least one lowercase letter (a-z)
                          </li>

                          <li className={`${rules.uppercase ? "text-green-600" : "text-red-600"}`}>
                            Include at least one uppercase letter (A-Z)
                          </li>

                          <li className={`${rules.number ? "text-green-600" : "text-red-600"}`}>
                            Include at least one number (0-9)
                          </li>

                          <li className={`${rules.special ? "text-green-600" : "text-red-600"}`}>
                            Include at least one special character (!@#$%)
                          </li>

                        </ul>
                      </div>
                    </div>




                    {/* Error and Success Messages */}
                    {userError && <p className="text-red-500 text-sm">{userError}</p>}
                    {success && <p className="text-green-600 text-sm">{success}</p>}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-[#0519CE] py-2 font-medium text-white transition hover:bg-[#0414a8] disabled:opacity-50 cursor-pointer"
                    >
                      {userLoading ? "Creating Account..." : "Create User"}
                    </button>


                  </form>
                </div>
              </div>
            )}


            {/* ===== CONFIRM ACTION POPUP ===== */}
            {confirmPopup?.open && (
              <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-[380px] text-center p-8 relative">

                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className={`rounded-full p-3 ${confirmPopup.status === "Deleted" ? "bg-red-600" : "bg-[#0519CE]"}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        {confirmPopup.status === "Deleted" ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
                        )}
                      </svg>
                    </div>
                  </div>

                  <h2 className="text-lg font-bold mb-2 text-gray-900">{confirmPopup.title}</h2>
                  <p className="text-sm text-gray-500 mb-6">{confirmPopup.message}</p>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    {/* Cancel */}
                    <button
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium cursor-pointer"
                      onClick={() => setConfirmPopup(null)}
                    >
                      Cancel
                    </button>

                    {/* Confirm */}
                    <button
                      className={`flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium cursor-pointer ${confirmPopup.status === "Deleted" ? "bg-red-600 hover:bg-red-700" : "bg-[#0519CE] hover:opacity-90"
                        }`}
                      onClick={async () => {
                        setConfirmPopup(null);
                        await handleAccountStatusChange(confirmPopup.userId, confirmPopup.status);
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* ===== SAVE CHANGES LOADER ===== */}
            {saving && (
              <div className="fixed inset-0 z-[12000] flex items-center justify-center ">
                <div className="flex flex-col items-center gap-3 ">
                  <img
                    src="/assets/images/favicon.png"
                    className="w-14 h-14 animate-spin"
                    alt="Loading"
                  />
                  <p className="text-white text-sm font-medium">
                    Saving changes...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
