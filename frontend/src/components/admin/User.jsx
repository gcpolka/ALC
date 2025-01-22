import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import userService from '../../service/userService';

const User = () => {
    const [User, setUser] = useState([]);
    const [filteredUser, setFilteredUser] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await userService.userAll();
                setUser(res.data.data);
                setFilteredUser(res.data.data);
            } catch (error) {
                console.error('Error fetching User:', error);
            }
        };
        fetchUser();
    }, []);

    const handleCreate = () => {
        navigate('/admin/user/create');
    };

    const handleEdit = (id) => {
        navigate(`/admin/user/edit/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await userService.deleteUser(id);

            const res = await userService.userAll();
            setUser(res.data.data);
            setFilteredUser(res.data.data);

            // Show success alert using SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'user deleted successfully.',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } catch (error) {
            setError('An error occurred while deleting the user.');
        }
    };

    const handleSearch = (e, type) => {
        const value = e.target.value;
        if (type === 'name') {
            setSearchName(value);
        } else if (type === 'role') {
            setSearchRole(value);
        }
        filterUser(value, type);
    };

    const filterUser = (value, type) => {
        let filtered = User;

        if (type === 'name' && value.trim() !== '') {
            filtered = filtered.filter(user =>
                `${user.title} ${user.firstName} ${user.lastName}`
                    .toLowerCase()
                    .includes(value.toLowerCase())
            );
        }

        setFilteredUser(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Pagination handlers
    const totalPages = Math.ceil(filteredUser.length / itemsPerPage);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Calculate current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUser = filteredUser.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className='tb-User'>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Name"
                    value={searchName}
                    onChange={(e) => handleSearch(e, 'name')}
                />
            </div>

            <button className='btn btn-primary mb-3' onClick={handleCreate}>
                เพิ่มข้อมูล
            </button>
            <div className="table-responsive">
                <table className="table table-bordered table-gray table-striped text-center">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">ชื่อ-นามสกุล</th>
                            <th scope="col">ชื่อผู้ใช้งาน</th>
                            <th scope="col">เบอร์โทร</th>
                            <th scope="col">สถานะ</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUser.length > 0 ? (
                            currentUser.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>{user.title} {user.firstName} {user.lastName}</td>
                                    <td>{user.username}</td>
                                    <td>{user.phone}</td>
                                    {
                                        user.role === 'employee' ? (
                                            <td>
                                                <p className='bg-info border'>พนักงาน</p>
                                            </td>
                                        ) : user.role === 'boss' ? (
                                            <td>
                                                <p className='bg-success border'>หัวหน้างาน</p>
                                            </td>
                                        ) : (
                                            <td>
                                                <p className='bg-secondary border'>แอดมิน</p>
                                            </td>
                                        )
                                    }
                                    <td>
                                        <button className='btn btn-warning mr-1 mt-1' onClick={() => handleEdit(user._id)}>แก้ไข</button>
                                        <button className='btn btn-danger mt-1' onClick={() => handleDelete(user._id)}>ลบ</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">ไม่พบข้อมูล</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {filteredUser.length > 0 && (
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-end">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={handlePreviousPage}>Previous</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageClick(index + 1)}>{index + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={handleNextPage}>Next</button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default User;