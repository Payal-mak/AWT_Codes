const ProfileCard = () => {
    const name = "Payal";
    const lang = "Javascript";
    const bio = "I love building full-stack apps and exploring new technologies";
    const imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA9sCaeYxCJ6uU68IdZWXLX317wJCwcr98SG9RoId0h1qSK2saHQhOWiP4oTgBi65K88FitEJMkMf7yWbMs_s2CAsnv5o4ojAps5wGEg&s=10";
    const hobbies = ["Coding", "Art", "Binge Watch Movies"];
    return (
        <div style={{ padding: "2rem", fontFamily: "Arial" }}>
            <h1>Welcome to {name}'s profile</h1>
            <img style={{ borderRadius: "50%", height: "200px", width: "200px", marginBottom: "1rem" }} src={imageUrl} alt="profile" />

            <p><strong>Favourite Language: {lang}</strong></p>
            <p><strong>Bio: {bio}</strong></p>

            <h1>Hobbies</h1>
            <ul>
                {hobbies.map((hobbies, index) => {
                    return <li key={index}>{hobbies}</li>;
                })}
            </ul>
        </div>
    );
}
export default ProfileCard;