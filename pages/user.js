import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => {
    return (
        <div className="mt-4 -ml-6">
            <UserProfile />
        </div>
    );
};

export default UserProfilePage;
