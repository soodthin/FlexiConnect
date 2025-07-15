const FormWrapper = ({ title, children }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white via-gray-100 to-beige">
    <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-10 w-full max-w-md border border-beige-dark">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6 tracking-wide">
        {title}
      </h1>
      {children}
    </div>
  </div>
);
export default FormWrapper;
