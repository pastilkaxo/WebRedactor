import React, { useState, useEffect } from 'react';
import { IUser } from '../../../../models/IUser';
import UserService from '../../../../Services/UserService';

const AdminView: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при загрузке пользователей');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleBlock = async (user: IUser) => {
        try {
            if (user.isBlocked) {
                await UserService.unblockUser(user.id);
            } else {
                await UserService.blockUser(user.id);
            }
            fetchUsers();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Произошла ошибка');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            try {
                await UserService.deleteUser(userId);
                fetchUsers();
            } catch (err: any) {
                alert(err.response?.data?.message || 'Произошла ошибка');
            }
        }
    };

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div>
            <h2>Управление пользователями</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ccc' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Активация</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Статус</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '8px' }}>{user.email}</td>
                            <td style={{ padding: '8px' }}>{user._id}</td>
                            <td style={{ padding: '8px' }}>{user.isActivated ? 'Активирован' : 'Не активирован'}</td>
                            <td style={{ padding: '8px' }}>{user.isBlocked ? 'Заблокирован' : 'Активен'}</td>
                            <td style={{ padding: '8px' }}>
                                <button onClick={() => handleToggleBlock(user)}>
                                    {user.isBlocked ? 'Разблокировать' : 'Блокировать'}
                                </button>
                                <button onClick={() => alert('Редактирование в разработке')}>
                                    Изменить
                                </button>
                                <button onClick={() => handleDeleteUser(user.id)}>
                                    Удалить
                                </button>
                                 <button onClick={() => alert('Просмотр контента в разработке')}>
                                    Контент
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminView;