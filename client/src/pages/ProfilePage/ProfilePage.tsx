import React from 'react';
import ProfileForm from '../../components/ProfileForm/ProfileForm';
import './ProfilePage.scss'
const ProfilePage: React.FC = () => {
    return (
        <div className='profilePage'>
            <ProfileForm />
        </div>
    );
}

export default ProfilePage;