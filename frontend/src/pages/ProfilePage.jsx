import { useAuthStore } from '../hooks/useAuthStore'

const ProfilePage = () => {
    const authUser = useAuthStore()
    return (
        <div>
        <h1>Profile Page</h1>
        </div>
    )
}

export default ProfilePage;