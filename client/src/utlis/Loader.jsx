import { MoonLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 ">
      <MoonLoader size={60} color="#111827" loading={true} />
    </div>
  );
};

export default Loader;
