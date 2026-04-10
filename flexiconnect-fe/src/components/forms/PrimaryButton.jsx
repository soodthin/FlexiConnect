const PrimaryButton = ({ children, variant = 'primary', ...props }) => {
  const variantClasses = {
    primary: 'btn btn-primary w-full',
    secondary: 'btn btn-secondary w-full',
    danger: 'btn btn-danger w-full',
  };

  return (
    <button className={variantClasses[variant]} {...props}>
      {children}
    </button>
  );
};

export default PrimaryButton;
