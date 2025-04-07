import { MoonLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-4  bg-gray-100">
      <MoonLoader size={60} color="#4A90E2" loading={true} />
    </div>
  );
};

export default Loader;
