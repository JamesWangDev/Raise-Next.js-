import { OrganizationProfile } from "@clerk/clerk-react";

const OrganizationProfilePage = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <OrganizationProfile hidePersonal={true} />
        </div>
    );
};

export default OrganizationProfilePage;
