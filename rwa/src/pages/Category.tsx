import { useParams } from "react-router-dom";


export default function Category() {
    const { slug } = useParams();

    return (
        <div className="page">
            <h2>Kategorija: {slug}</h2>
            <p>Ovdje će kasnije ići filtrirani kokteli po alkoholu.</p>
        </div>
    );
}
