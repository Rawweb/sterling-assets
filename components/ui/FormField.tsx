export default function FormField({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className='mb-1.5 block text-sm font-medium'>
        {label}
        {required && <span className='ml-0.5 text-down'>*</span>}
      </label>
      {children}
    </div>
  );
}
