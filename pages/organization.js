import { OrganizationProfile } from "@clerk/nextjs";

const OrganizationProfilePage = () => {
    return (
        <div className="mt-4 -ml-6">
            <OrganizationProfile hidePersonal={true} />
        </div>
    );
};

export default OrganizationProfilePage;
