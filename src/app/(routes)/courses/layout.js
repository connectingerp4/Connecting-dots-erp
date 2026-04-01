import { metadata } from './metadata';

export { metadata };

// This is a Server Component by default
export default function CoursesLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
