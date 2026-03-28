import React from 'react';
import ProfileForm from '../../components/ProfileForm/ProfileForm';
import './ProfilePage.scss'
const Profile: React.FC = () => {
    return (
        <div className='profilePage'>
            <ProfileForm />
        </div>
    );
}

export default Profile;