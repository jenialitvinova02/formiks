import React from 'react';
import {ProfileForm} from '../../components';
import './ProfilePage.scss'
export const ProfilePage: React.FC = () => {
    return (
        <div className='profilePage'>
            <ProfileForm />
        </div>
    );
}

export default ProfilePage;