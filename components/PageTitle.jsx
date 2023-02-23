export default function PageTitle({ title, descriptor }) {
    return (
        <>
            <h1>{title}</h1>
            <h2 className="page-title-descriptor">{descriptor}</h2>
        </>
    );
}
