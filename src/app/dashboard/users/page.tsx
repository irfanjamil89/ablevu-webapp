"use client";


import React, { useState, useEffect } from 'react'

// User Interface
interface User {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    user_role: 'Contributor' | 'Business' | 'User';
    created_at: string;
}

// Component State Types
type UserRole = 'Contributor' | 'Business' | 'User' | '';

export default function Page() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<UserRole>('');

    
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




    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, selectedRole]);

    const fetchUsers = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}users/`);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data: User[] = await response.json();
            setUsers(data);
            setFilteredUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = (): void => {
        let filtered = [...users];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter((user: User) => {
                const name = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
                const email = user.email.toLowerCase();
                const search = searchTerm.toLowerCase();
                return name.includes(search) || email.includes(search);
            });
        }

        // Filter by role
        if (selectedRole) {
            filtered = filtered.filter((user: User) => user.user_role === selectedRole);
        }

        setFilteredUsers(filtered);
    };

    const clearFilters = (): void => {
        setSearchTerm('');
        setSelectedRole('');
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getFullName = (user: User): string => {
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        return firstName || lastName ? `${firstName} ${lastName}`.trim() : 'No Name';
    };

    const handleRoleSelect = (role: UserRole): void => {
        setSelectedRole(role);
    };

   
    if (loading) {
        return <div className="flex justify-center w-full items-center h-[400px]">
            <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Favicon" />
        </div>;
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
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };


    return (
        <div className="w-full ">
            <div
                className="flex items-center justify-between border-b border-gray-200 bg-white">
                <div className="w-full min-h-screen bg-white">

                    {/* <!-- Header Row --> */}
                    <div className="w-full min-h-screen bg-white px-6 py-5">

                        {/* <!-- Header --> */}
                        <div className="flex flex-wrap gap-y-4 items-center justify-between mb-8">
                            {/* <!-- Title --> */}

                            <h1
                                className="text-2xl font-semibold text-gray-900">All Users ({filteredUsers.length})</h1>

                            {/* <!-- Controls --> */}

                            <div className="flex flex-wrap gap-y-4 items-center gap-3">

                                {/* clear all */}
                                <div className="text-md text-gray-500 cursor-pointer hover:text-gray-700"
                                    onClick={clearFilters}
                                >
                                    <div className="text-md text-gray-500 cursor-pointer">Clear All</div>
                                </div>


                                {/* <!-- BUSINESS STATUS --> */}

                                <div className="relative inline-block text-left">
                                    {/* <!-- Hidden Toggle --> */}
                                    <input type="checkbox" id="business-status-toggle" className="hidden peer" />

                                    {/* <!-- Trigger --> */}
                                    <label
                                        htmlFor="business-status-toggle"
                                        className="flex items-center justify-between border border-gray-300 text-gray-500 text-sm px-3 py-2.5 rounded-lg hover:border-[#0519CE] cursor-pointer w-auto md:w-[250px] transition-all duration-200"
                                    >
                                        {selectedRole || 'User Role'}
                                        <svg
                                            className="w-2.5 h-2.5 ms-3 transition-transform duration-200 peer-checked:rotate-180"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 10 6"
                                        >
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                        </svg>
                                    </label>

                                    {/* <!-- Click outside overlay --> */}
                                    <label htmlFor="business-status-toggle" className="hidden peer-checked:block fixed inset-0 z-10"></label>

                                    {/* <!-- Dropdown --> */}
                                    <div className="absolute z-20 mt-2 hidden peer-checked:block border border-gray-200 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-[250px]">
                                        <ul className="py-2 text-sm text-gray-700">
                                            <li>
                                                <label htmlFor="business-status-toggle">
                                                    <a
                                                        onClick={() => handleRoleSelect('Contributor')}
                                                        className="block px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        Contributor
                                                    </a>
                                                </label>
                                            </li>
                                            <li>
                                                <label htmlFor="business-status-toggle">
                                                    <a
                                                        onClick={() => handleRoleSelect('Business')}
                                                        className="block px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        Business
                                                    </a>
                                                </label>
                                            </li>
                                            <li>
                                                <label htmlFor="business-status-toggle">
                                                    <a
                                                        onClick={() => handleRoleSelect('User')}
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
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search by Name, Email"
                                        value={searchTerm}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                        className="w-full border-none focus:outline-none focus:ring-0 font-medium text-sm text-gray-700 placeholder-gray-700 ml-2"
                                    />
                                </div>

                            </div>
                        </div>

                        {/* <!-- Empty State Content --> */}
                        <section className="flex-1">


                            <input type="radio" name="menuGroup" id="none" className="hidden" defaultChecked />

                            <div className="h-auto overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-[#EFF0F1] text-gray-500 text-sm font-bold">
                                        <tr>
                                            <th scope="col" className="w-auto lg:w-[800px] py-3 pr-3 pl-3">Name/Email</th>
                                            <th scope="col" className="px-6 py-3">Joining Date</th>
                                            <th scope="col" className="w-auto lg:w-[200px] px-6 py-3">User Role</th>
                                            <th scope="col" className="px-6 py-3">Profiles Created</th>
                                            <th scope="col" className="px-3 py-3 text-right"></th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200">
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                    No users found
                                                </td>
                                            </tr>
                                        ) : (
                                            currentFeatures.map((user: User, index: number) => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-5 pr-4 pl-3 w-[60%]">
                                                        <span className="block font-semibold">{getFullName(user)}</span>
                                                        <span className="text-sm text-gray-600">{user.email}</span>
                                                    </td>
                                                    <td className="px-6 py-5 w-4/5">{formatDate(user.created_at)}</td>
                                                    <td className="px-6 py-5 w-4/5">{user.user_role}</td>

                                                    {/* Dropdown Cell */}
                                                    <td className="relative px-6 py-5 text-right w-4/5">
                                                        <input
                                                            type="radio"
                                                            name="menuGroup"
                                                            id={`menuToggle${index}`}
                                                            className="hidden peer"
                                                        />
                                                        <label
                                                            htmlFor={`menuToggle${index}`}
                                                            className="cursor-pointer text-gray-500 text-2xl select-none"
                                                        >
                                                            ⋮
                                                        </label>
                                                        {/* <label
                                                            htmlFor="none"
                                                            className="hidden peer-checked:block fixed inset-0 z-40"
                                                        ></label> */}
                                                        {/* <div className="absolute right-0 mt-2 w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 hidden peer-checked:flex flex-col">
                                                            <button className="flex items-center border-b border-gray-200 gap-2 px-4 py-2 text-gray-700 hover:bg-[#EFF0F1] text-sm">
                                                                Edit
                                                            </button>
                                                            <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 text-sm rounded-b-lg">
                                                                Delete
                                                            </button>
                                                        </div> */}
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
                                              Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} entries
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
                                                    {page === '...' ? (
                                                      <span className="px-3 py-1 text-gray-500">...</span>
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


                        </section>
                    </div>

                </div>

            </div>
        </div>
    )
}

