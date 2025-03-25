
import ClipLoader from "react-spinners/ClipLoader";

const Loader = ({ color = "#F33E0A", size = 25, speedMultiplier = 1 }) => {
    return <ClipLoader color={color} size={size} speedMultiplier={speedMultiplier} />;
};

export default Loader;
